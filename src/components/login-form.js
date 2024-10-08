import React, { useState } from 'react';
import './styling/login-form.css'

const LogInForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { username, email, password } = formData;

    // Basic validation
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    setError('');
    
    // Submit form data (can be sent to a backend)
    console.log('Form submitted', formData);
  };

  return (
    <div className="login-form">
      <h1 className='welcome-msg'>Welcome Back to Crewcut</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LogInForm;
