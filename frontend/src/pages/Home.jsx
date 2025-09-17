import "../styles/Home.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: integrate loginUser API
      // const { user, token } = await loginUser(form);
      // login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="home-container">
      <h1 className="brand-logo">Fauxstagram</h1>

      <form className="login-form" onSubmit={handleSubmit}>
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
        <button className="btn login-btn" type="submit">
          Login
        </button>
      </form>

      <div className="signup-redirect">
        <p>
          Don’t have an account?{" "}
          <Link to="/register" className="register-link">
            Sign up
          </Link>
        </p>
      </div>

      <footer className="home-footer">
        <p>© 2025 Fauxstagram. All rights reserved.</p>
      </footer>
    </div>
  );
}
