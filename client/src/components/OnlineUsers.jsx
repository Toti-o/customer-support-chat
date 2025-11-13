import React from 'react';

const OnlineUsers = ({ users, currentUser }) => {
  const agents = users.filter(user => user.type === 'agent');
  const customers = users.filter(user => user.type === 'customer');

  return (
    <div className="online-users">
      <h3>Online Users ({users.length})</h3>
      
      <div className="users-section">
        <h4>Support Agents ({agents.length})</h4>
        {agents.map(user => (
          <div key={user.id} className="user-item">
            <span className="user-status online"></span>
            <span className="username">
              {user.username}
              {user.id === currentUser.id && ' (You)'}
            </span>
            <span className="user-badge agent">Agent</span>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="user-item">
            <span style={{ color: '#999', fontStyle: 'italic' }}>
              No agents online
            </span>
          </div>
        )}
      </div>

      <div className="users-section">
        <h4>Customers ({customers.length})</h4>
        {customers.map(user => (
          <div key={user.id} className="user-item">
            <span className="user-status online"></span>
            <span className="username">
              {user.username}
              {user.id === currentUser.id && ' (You)'}
            </span>
            <span className="user-badge customer">Customer</span>
          </div>
        ))}
        {customers.length === 0 && (
          <div className="user-item">
            <span style={{ color: '#999', fontStyle: 'italic' }}>
              No customers online
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;