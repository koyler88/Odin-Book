import axios from "axios";

const API_URL = "http://localhost:3000";

export async function loginUser(credentials) {
  const res = await axios.post(`${API_URL}/auth/login`, credentials);
  return res.data;
}

export async function registerUser(data) {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
}
