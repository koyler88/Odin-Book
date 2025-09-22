import axios from "axios";

const API_URL = "http://localhost:3000";

export const createPost = async (formData, token) => {
  // fallback to localStorage if token is not passed
  const jwt = token || localStorage.getItem("token");

  const res = await axios.post(`${API_URL}/posts`, formData, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
