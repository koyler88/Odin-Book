import "../styles/Feed.css";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function Feed() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedType, setFeedType] = useState("all");
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [postComments, setPostComments] = useState({});

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint = feedType === "all" ? "/posts" : "/posts/following";
  const res = await axios.get(`${API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    if (user) fetchPosts();
  }, [feedType, user]);

  // Fetch logged-in user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
  const res = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [user]);

  // Search users
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery) {
        setUserSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(
          `${API_URL}/users/search?username=${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserSearchResults(res.data);
      } catch (err) {
        console.error("Error searching users:", err);
      }
    };
    searchUsers();
  }, [searchQuery]);

  // Fetch Comments
  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(
        `${API_URL}/posts/${postId}/comments`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPostComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const toggleComments = async (postId) => {
    const isExpanded = expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }));

    // Fetch comments if not already fetched
    if (!postComments[postId]) {
      await fetchComments(postId);
    }
  };

  // Toggle like
  const toggleLike = async (postId, liked) => {
    try {
      if (liked) {
  await axios.delete(`${API_URL}/posts/${postId}/like`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(
          `${API_URL}/posts/${postId}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      // refresh posts after like/unlike
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                _count: {
                  ...p._count,
                  likes: liked ? p._count.likes - 1 : p._count.likes + 1,
                },
                likedByUser: !liked,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // Add comment
  const addComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content) return;
    try {
      await axios.post(
        `${API_URL}/posts/${postId}/comments`,
        { content },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // reset input + increment comment count
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                _count: { ...p._count, comments: p._count.comments + 1 },
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className="feed-container">
      {/* Header */}
      <header className="feed-header">
        <h1 className="brand-logo">Fauxstagram</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && userSearchResults.length > 0 && (
            <ul className="user-search-results">
              {userSearchResults.map((u) => (
                <li key={u.id}>
                  <Link to={`/profile/${u.id}`}>
                    <img
                      src={u.profile?.avatarUrl || "https://picsum.photos/28"}
                      alt={u.username}
                      className="search-avatar"
                    />
                    {u.username}
                  </Link>
                </li>
              ))}
            </ul>
          )}
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
        {posts.map((post) => {
          const liked = post.likedByUser || false;
          return (
            <div key={post.id} className="post-wrapper">
              <div className="post">
                <div className="post-header">
                  <img
                    src={
                      post.author.profile?.avatarUrl ||
                      "https://picsum.photos/40"
                    }
                    alt="profile"
                    className="post-avatar"
                  />
                  <span className="post-username">
                    <Link to={`/profile/${post.author.id}`}>
                      {post.author.username}
                    </Link>
                  </span>
                </div>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="post" className="post-image" />
                )}
                <div className="post-footer">
                  <div className="post-actions">
                    <button onClick={() => toggleLike(post.id, liked)}>
                      {liked ? "💖" : "🤍"} {post._count.likes}
                    </button>
                    <button>💬 {post._count.comments}</button>
                  </div>
                  {post.content && (
                    <p>
                      <strong>{post.author.username}</strong> {post.content}
                    </p>
                  )}
                  {post._count.comments > 0 && (
                    <button
                      className="view-comments-btn"
                      onClick={() => toggleComments(post.id)}
                    >
                      {expandedComments[post.id]
                        ? "Hide comments"
                        : `View ${post._count.comments} comment${
                            post._count.comments > 1 ? "s" : ""
                          }`}
                    </button>
                  )}

                  {/* Render comments if expanded */}
                  {expandedComments[post.id] &&
                    postComments[post.id]?.map((c) => (
                      <p key={c.id} className="comment">
                        <strong>{c.author.username}</strong> {c.content}
                      </p>
                    ))}

                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                  {/* Comment input */}
                  <div className="comment-box">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                    />
                    <button onClick={() => addComment(post.id)}>Post</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <Link to="/feed" className="nav-item">
          🏠
        </Link>
        <Link to="/create" className="nav-item">
          ➕
        </Link>
        <Link to="/messages" className="nav-item">
          💬
        </Link>
        <Link to="/profile" className="nav-item">
          <img
            src={profile?.avatarUrl || "https://picsum.photos/28"}
            alt="profile"
            className="nav-avatar"
          />
        </Link>
      </nav>
    </div>
  );
}
