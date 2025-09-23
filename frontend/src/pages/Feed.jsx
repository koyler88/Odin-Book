import "../styles/Feed.css";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export default function Feed() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="feed-container">
      {/* Header */}
      <header className="feed-header">
        <h1 className="brand-logo">Fauxstagram</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </header>

      {/* Feed */}
      <main className="feed-content">
        {/* Placeholder posts */}
        <div className="post">
          <div className="post-header">
            <img
              src="https://picsum.photos/29"
              alt="profile"
              className="post-avatar"
            />
            <span className="post-username">user123</span>
          </div>
          <img
            src="https://picsum.photos/400/322"
            alt="post"
            className="post-image"
          />
          <div className="post-footer">
            <p>
              <strong>user123</strong> This is a sample caption.
            </p>
          </div>
        </div>

        <div className="post">
          <div className="post-header">
            <img
              src="https://picsum.photos/30"
              alt="profile"
              className="post-avatar"
            />
            <span className="post-username">jane_doe</span>
          </div>
          <img
            src="https://picsum.photos/400/300"
            alt="post"
            className="post-image"
          />
          <div className="post-footer">
            <p>
              <strong>jane_doe</strong> Loving the vibes ✨
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <Link to="/feed" className="nav-item">
          <span>🏠</span>
        </Link>
        <Link to="/create" className="nav-item">
          <span>➕</span>
        </Link>
        <Link to="/messages" className="nav-item">
          <span>💬</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <img
            src={user?.avatar || "https://picsum.photos/18"}
            alt="profile"
            className="nav-avatar"
          />
        </Link>
      </nav>
    </div>
  );
}
