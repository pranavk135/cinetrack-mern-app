// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PublicExplorer from './components/PublicExplorer';
import { apiGet } from './utils/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('ct_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('ct_user')||'null'));
  const [viewPublic, setViewPublic] = useState(false);

  useEffect(()=> {
    if (!token) { setUser(null); localStorage.removeItem('ct_user'); localStorage.removeItem('ct_token'); }
  }, [token]);

  const onLogin = (userObj, jwt) => {
    setUser(userObj);
    setToken(jwt);
    localStorage.setItem('ct_token', jwt);
    localStorage.setItem('ct_user', JSON.stringify(userObj));
  };

  const onLogout = () => { setToken(null); setUser(null); };

  return (
    <div className="app">
      <header className="header">
        <h1>CineTrack</h1>
        <nav>
          {token ? <button onClick={onLogout}>Logout</button> : null}
          <button onClick={()=>setViewPublic(v=>!v)}>{viewPublic ? 'My Dashboard' : 'Public Explorer'}</button>
        </nav>
      </header>

      <main>
        {!token ? (
          <div className="auth-grid">
            <Login onLogin={onLogin}/>
            <Register onLogin={onLogin}/>
          </div>
        ) : (
          viewPublic ? <PublicExplorer/> : <Dashboard token={token} />
        )}
      </main>

      <footer className="footer">CineTrack • Demo</footer>
    </div>
  );
}
  