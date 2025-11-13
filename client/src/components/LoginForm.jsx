import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    type: 'customer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username.trim() && formData.email.trim()) {
      onLogin(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Join Support Chat</h2>
        
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="customer">Customer</option>
            <option value="agent">Support Agent</option>
          </select>
        </div>

        <button type="submit" className="login-btn">
          Join Chat
        </button>
      </form>
    </div>
  );
};

export default LoginForm;