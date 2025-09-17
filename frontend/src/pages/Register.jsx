// Register.jsx
import "../styles/Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: integrate registerUser API
      // await registerUser(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="register-container">
      <h2>Sign Up</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button className="btn signup-btn" type="submit">
          Sign Up
        </button>
      </form>

      <p className="redirect-text">
        Already have an account? <Link to="/">Log in</Link>
      </p>
    </div>
  );
}
