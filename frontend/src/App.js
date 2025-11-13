import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Search from './components/Search';
import PublicExplorer from './components/PublicExplorer';
import Login from './components/Login';
import Register from './components/Register';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('ct_token') || null);
  const [theme, setTheme] = useState(localStorage.getItem('ct_theme') || 'dark');

  useEffect(()=> {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ct_theme', theme);
  },[theme]);

  const onLogin = (userObj, tokenStr) => {
    localStorage.setItem('ct_token', tokenStr);
    setToken(tokenStr);
  };
  const onLogout = () => {
    localStorage.removeItem('ct_token');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Navbar theme={theme} setTheme={setTheme} token={token} onLogout={onLogout} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard token={token} />} />
          <Route path="/search" element={<Search token={token} />} />
          <Route path="/explore" element={<PublicExplorer />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/register" element={<Register onLogin={onLogin} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
