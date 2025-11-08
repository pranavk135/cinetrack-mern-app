// frontend/src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // ✅ Store token in localStorage (must be "ct_token")
      localStorage.setItem("ct_token", r.data.token);

      if (onLogin) onLogin(r.data.user, r.data.token);
      window.location.reload(); // refresh to re-trigger dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3>Login</h3>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button className="btn" type="submit">
        Login
      </button>
    </form>
  );
}
