import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setRole } from '../redux/authSlice';
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import './SignUp.css';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getRole = async () => {
    const response = await axios.get('http://localhost:5000/user/role', {
      withCredentials: true,
    });
    
    
    dispatch(setRole(response.data.role));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    // Basic validation
    if (!name || !password) {
      setMessage('Please fill in all fields.');
      return;
    }   

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        name,
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        getRole();
        navigate('/home');
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="page-layout">
      <nav className="nav-bar">
        <div className="nav-left">
          <button className="icon-button" onClick={() => navigate('/')} title="Back to Home">
            <IoMdArrowRoundBack />
          </button>
          <h1 className="nav-title">Login</h1>
        </div>
      </nav>

      <div className="page-container">
        <div className="signup-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="button button-primary">Login</button>
          </form>
          <p className="auth-link"><a href="/signup">No account? Sign up here</a></p>
          {message && <p className="error-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
