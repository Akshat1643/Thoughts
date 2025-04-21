import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import "../styles/Login.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/auth/login',
        formData,
        { withCredentials: true }
      );

      const data = res.data;
      setToastMessage(data.message || "Login success");
      setShowToast(true);

      if (data.success) {
        setTimeout(() => navigate('/'), 1500); // Navigate after showing toast
      }
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || "Login error");
      setShowToast(true);
    }
  };

  return (
    <div className='register-container'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className='register-form'>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="success" className='w-100 mt-2'>Login</Button>
        <Button variant="secondary" className='w-100 mt-2' onClick={() => navigate('/register')}>
          Don't have an account? Register
        </Button>
      </form>

      {/* Toast Notification */}
      <div style={{ position: 'fixed', top: 20, right: 20 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="info"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
};

export default Login;
