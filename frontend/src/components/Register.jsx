import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Register({ onLogin }){
  const [username,setUsername]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const nav = useNavigate();
  async function submit(e){ e.preventDefault();
    try {
      const r = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/register`, { username, email, password });
      onLogin(r.data.user, r.data.token);
      nav('/');
    } catch(err){ alert(err.response?.data?.message || 'Register failed'); }
  }
  return (
    <div className="card auth-card">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn" type="submit">Register</button>
      </form>
    </div>
  );
}
