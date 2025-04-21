import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home2 from './pages/Home2';
import Login from './pages/Login'
import Register from './pages/Register'
import "./App.css"
const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home2/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
    </Routes>
  </Router>
  )
}

export default App
