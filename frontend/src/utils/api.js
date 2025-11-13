// frontend/src/utils/api.js
import axios from "axios";
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function apiGet(url, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.get(BASE + url, { headers });
  return res.data;
}
export async function apiPost(url, token, body) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.post(BASE + url, body, { headers });
  return res.data;
}
export async function apiPut(url, token, body) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.put(BASE + url, body, { headers });
  return res.data;
}
export async function apiDelete(url, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await axios.delete(BASE + url, { headers });
  return res.data;
}
