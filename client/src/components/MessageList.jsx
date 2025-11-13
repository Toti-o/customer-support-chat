import React from 'react';

const MessageList = ({ messages, currentUser, socket }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isOwnMessage = (message) => {
    return message.userId === socket.id;
  };

  const renderMessageContent = (message) => {
    if (message.type === 'file') {
      const fileExtension = message.fileName.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
      
      if (isImage) {
        return (
          <div className="file-message">
            <img 
              src={`http://localhost:5000${message.file}`} 
              alt={message.fileName}
              className="uploaded-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="file-info">
              <span>{message.fileName}</span>
              <span>({formatFileSize(message.fileSize)})</span>
            </div>
          </div>
        );
      } else {
        return (
          <div className="file-message">
            <div className="file-icon">📎</div>
            <div className="file-info">
              <a 
                href={`http://localhost:5000${message.file}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {message.fileName}
              </a>
              <span>({formatFileSize(message.fileSize)})</span>
            </div>
          </div>
        );
      }
    }
    
    return <div className="message-text">{message.message}</div>;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <h3>No messages yet</h3>
          <p>Start a conversation by sending a message!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message) => {
        if (message.type === 'system') {
          return (
            <div key={message.id} className="system-message">
              <span>{message.message}</span>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={`message ${isOwnMessage(message) ? 'own-message' : 'other-message'}`}
          >
            <div className="message-header">
              <strong>{message.username}</strong>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
            
            {renderMessageContent(message)}
            
            <div className="message-status">
              {isOwnMessage(message) && (
                <span className="read-status">
                  {message.readBy.length > 1 ? '✓✓ Read' : '✓ Delivered'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;