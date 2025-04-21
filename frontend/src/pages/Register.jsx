import React, { useState } from 'react';
import axios from 'axios';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import "../styles/Register.css"

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

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
        'http://localhost:3000/auth/register',
        formData,
        { withCredentials: true }
      );

      const data = res.data;
      setToastMessage(data.message);
      setShowToast(true);

      if (data.success) {
        setFormData({ username: '', email: '', password: '' });
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setToastMessage(err.response.data.message);
      } else {
        setToastMessage("Something went wrong. Please try again.");
      }
      setShowToast(true);
    }
  };

  return (
    <div className='register-container'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className='register-form'>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
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
        <Button type="submit" variant="primary" className='w-100 mt-2'>Register</Button>
        <Button variant="success" className='w-100 mt-2' onClick={() => navigate('/login')}>
          Already have an account? Login
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

export default Register;
