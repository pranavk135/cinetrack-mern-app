// frontend/src/utils/api.js
import axios from "axios";

// ✅ Use one consistent base URL (your backend)
const API_BASE = "http://localhost:5000";

// ✅ Centralized Axios instance (handles baseURL and JSON headers)
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("ct_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// --- ✅ Generic API Wrappers ---

export async function apiGet(url, token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.get(url, { headers });
    return res.data;
  } catch (err) {
    console.error(`GET ${url} failed:`, err.response?.data || err);
    throw err;
  }
}

export async function apiPost(url, token, body) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.post(url, body, { headers });
    return res.data;
  } catch (err) {
    console.error(`POST ${url} failed:`, err.response?.data || err);
    throw err;
  }
}

export async function apiPut(url, token, body) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.put(url, body, { headers });
    return res.data;
  } catch (err) {
    console.error(`PUT ${url} failed:`, err.response?.data || err);
    throw err;
  }
}

export async function apiDelete(url, token) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axiosInstance.delete(url, { headers });
    return res.data;
  } catch (err) {
    console.error(`DELETE ${url} failed:`, err.response?.data || err);
    throw err;
  }
}
