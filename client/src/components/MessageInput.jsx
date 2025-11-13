import React, { useState, useRef } from 'react';
import axios from 'axios';

const MessageInput = ({ socket, user }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', { message: message.trim() });
      setMessage('');
      stopTyping();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    if (e.target.value.trim() && !isTyping) {
      setIsTyping(true);
      socket.emit('typing_start', { username: user.username });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      socket.emit('typing_stop', { username: user.username });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      socket.emit('send_file', {
        file: response.data.path,
        fileName: response.data.originalName,
        fileSize: file.size
      });
    } catch (error) {
      console.error('File upload failed:', error);
      alert(error.response?.data?.error || 'File upload failed. Please try again.');
    }

    // Reset file input
    e.target.value = '';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <div className="input-container">
        <button
          type="button"
          className="file-upload-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Upload file (images, PDF, documents)"
        >
          📎
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx"
        />
        
        <textarea
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onBlur={stopTyping}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          rows="1"
        />
        
        <button type="submit" disabled={!message.trim()} className="send-btn">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;