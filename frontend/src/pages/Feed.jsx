import "../styles/Feed.css";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Feed() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedType, setFeedType] = useState("all");
  const [posts, setPosts] = useState([]);

  // Fetch posts based on feedType
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = feedType === "all" ? "/posts" : "/posts/following";
        const res = await axios.get(`http://localhost:3000${endpoint}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchPosts();
  }, [feedType, user]);

  const filteredPosts = posts.filter((post) =>
    post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      {/* Feed Selection */}
      <div className="feed-selection">
        <button
          className={feedType === "all" ? "feed-btn active" : "feed-btn"}
          onClick={() => setFeedType("all")}
        >
          All
        </button>
        <button
          className={feedType === "following" ? "feed-btn active" : "feed-btn"}
          onClick={() => setFeedType("following")}
        >
          Following
        </button>
      </div>

      {/* Feed */}
      <main className="feed-content">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <img
                src={post.author.profile?.avatarUrl || "https://picsum.photos/40"}
                alt="profile"
                className="post-avatar"
              />
              <span className="post-username">{post.author.username}</span>
            </div>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="post" className="post-image" />
            )}
            <div className="post-footer">
              <div className="post-actions">
                <button>❤️ {post._count.likes}</button>
                <button>💬 {post._count.comments}</button>
              </div>
              {post.content && (
                <p>
                  <strong>{post.author.username}</strong> {post.content}
                </p>
              )}
              <span className="post-date">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <Link to="/feed" className="nav-item">🏠</Link>
        <Link to="/create" className="nav-item">➕</Link>
        <Link to="/messages" className="nav-item">💬</Link>
        <Link to="/profile" className="nav-item">
          <img
            src={user?.avatar || "https://picsum.photos/28"}
            alt="profile"
            className="nav-avatar"
          />
        </Link>
      </nav>
    </div>
  );
}
