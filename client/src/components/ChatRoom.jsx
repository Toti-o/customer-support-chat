import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';
import TypingIndicator from './TypingIndicator';
import { useNotifications } from '../hooks/useNotifications';

const ChatRoom = ({ socket, user, onlineUsers }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Use the notifications hook
  useNotifications(messages, user, socket);

  useEffect(() => {
    socket.on('chat_history', (history) => {
      setMessages(history);
    });

    socket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      
      // Increase unread count if not focused
      if (!document.hasFocus()) {
        setUnreadCount(prev => prev + 1);
      }
    });

    socket.on('user_typing', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.username), data.username]);
      } else {
        setTypingUsers(prev => prev.filter(u => u !== data.username));
      }
    });

    socket.on('message_read', (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, readBy: data.readBy }
          : msg
      ));
    });

    socket.on('user_joined', (data) => {
      // Add system message when user joins
      const systemMessage = {
        id: Date.now().toString(),
        username: 'System',
        message: data.message,
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    socket.on('user_left', (data) => {
      // Add system message when user leaves
      const systemMessage = {
        id: Date.now().toString(),
        username: 'System',
        message: data.message,
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    return () => {
      socket.off('chat_history');
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('message_read');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleFocus = () => {
      setUnreadCount(0);
      // Mark all messages as read
      messages.forEach(message => {
        if (!message.readBy.includes(socket.id)) {
          socket.emit('mark_read', message.id);
        }
      });
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [messages, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-room">
      <div className="chat-sidebar">
        <OnlineUsers users={onlineUsers} currentUser={user} />
      </div>
      
      <div className="chat-main">
        <div className="chat-header">
          <h2>Support Chat</h2>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}
        </div>
        
        <MessageList 
          messages={messages} 
          currentUser={user}
          socket={socket}
        />
        
        <TypingIndicator typingUsers={typingUsers} />
        
        <MessageInput 
          socket={socket} 
          user={user}
        />
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatRoom;