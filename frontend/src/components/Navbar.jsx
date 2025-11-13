import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
export default function Navbar({ theme, setTheme, token, onLogout }){
  const navigate = useNavigate();
  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="brand" onClick={()=>navigate('/')}>🎬 <span className="brand-name">CineTrack</span></div>
        <nav className="links">
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
          <Link to="/explore">Public</Link>
        </nav>
      </div>
      <div className="nav-right">
        <button className="theme-btn" onClick={toggle}>{theme==='dark'?'☀️':'🌙'}</button>
        {token ? <button className="btn" onClick={() => { onLogout(); navigate('/login'); }}>Logout</button> :
          <>
            <Link to="/login" className="btn-link">Login</Link>
            <Link to="/register" className="btn secondary">Register</Link>
          </>}
      </div>
    </header>
  );
}
