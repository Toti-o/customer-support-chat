import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ChatRoom from './components/ChatRoom';
import LoginForm from './components/LoginForm';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socket.on('users_online', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('users_online');
    };
  }, []);

  const handleLogin = (userData) => {
    const userWithId = { ...userData, id: socket.id };
    setUser(userWithId);
    socket.emit('user_join', userData);
  };

  const handleLogout = () => {
    socket.disconnect();
    setUser(null);
    setTimeout(() => socket.connect(), 100);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Customer Support Chat</h1>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'online' : 'offline'}`}>
            {isConnected ? '🟢 Online' : '🔴 Offline'}
          </span>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.username} ({user.type})</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <ChatRoom 
          socket={socket} 
          user={user} 
          onlineUsers={onlineUsers}
        />
      )}
    </div>
  );
}

export default App;