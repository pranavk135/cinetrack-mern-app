import React, { useState } from 'react';
import axios from 'axios';

export default function Register({ onLogin }) {
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const submit = async e => {
    e.preventDefault();
    try {
      const r = await axios.post('http://localhost:5000/api/auth/register',{ username, email, password });
      onLogin(r.data.user, r.data.token);
    } catch (err) {
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Register</h3>
      <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required/></label>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
      <button className="btn" type="submit">Create account</button>
    </form>
  );
}
