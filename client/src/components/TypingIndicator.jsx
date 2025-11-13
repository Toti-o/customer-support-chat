import React from 'react';

const TypingIndicator = ({ typingUsers }) => {
  if (typingUsers.length === 0) return null;

  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        {typingUsers.slice(0, 3).join(', ')} 
        {typingUsers.length > 3 ? ` and ${typingUsers.length - 3} more` : ''}
        {typingUsers.length === 1 ? ' is' : ' are'} typing
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    </div>
  );
};

export default TypingIndicator;