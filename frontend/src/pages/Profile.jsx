import "../styles/Profile.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function Profile() {
  const { user } = useAuth();
  const { id } = useParams();
  const isMyProfile = !id || Number(id) === user.id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    avatarFile: null,
  });
  const [preview, setPreview] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  // Post editing
  const [editingPost, setEditingPost] = useState(null);
  const [editingPostFile, setEditingPostFile] = useState(null);
  const [editingPostCaption, setEditingPostCaption] = useState("");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = isMyProfile ? "/users/me" : `/users/${id}/profile`;
        const res = await axios.get(`http://localhost:3000${url}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(res.data);
        setFormData({
          bio: res.data.bio || "",
          location: res.data.location || "",
          avatarFile: null,
        });
        setPreview(res.data.avatarUrl || "");

        if (!isMyProfile) {
          const followRes = await axios.get(
            `http://localhost:3000/users/${id}/is-following`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setIsFollowing(followRes.data.isFollowing);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [id]);

  // Fetch posts
  useEffect(() => {
    if (!profile) return;
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/posts/user/${profile.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [profile]);

  // Profile save
  const handleSave = async () => {
    try {
      // Update bio/location
      const res = await axios.put(
        "http://localhost:3000/users/me",
        { bio: formData.bio, location: formData.location },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      let updatedProfile = res.data;

      // Upload avatar if selected
      if (formData.avatarFile) {
        const uploadData = new FormData();
        uploadData.append("avatar", formData.avatarFile);

        const avatarRes = await axios.post(
          "http://localhost:3000/users/me/avatar",
          uploadData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        updatedProfile = avatarRes.data;
      }

      setProfile(updatedProfile);
      setFormData({ ...formData, avatarFile: null });
      setPreview(updatedProfile.avatarUrl || "");
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, avatarFile: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setFormData({ ...formData, avatarFile: null });
    setPreview(profile.avatarUrl || "");
    setEditing(false);
  };

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:3000/users/${id}/follow`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(
          `http://localhost:3000/users/${id}/follow`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  // Post delete
  const handleDeletePost = async (postId) => {
    if (!confirm("Delete this post?")) return;
    try {
      await axios.delete(`http://localhost:3000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  // Post save
  const handleSavePostEdit = async () => {
    try {
      const formData = new FormData();
      if (editingPostFile) formData.append("image", editingPostFile);
      formData.append("content", editingPostCaption);

      const res = await axios.put(
        `http://localhost:3000/posts/${editingPost.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPosts(posts.map((p) => (p.id === editingPost.id ? res.data : p)));
      setEditingPost(null);
      setEditingPostFile(null);
      setEditingPostCaption("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelPostEdit = () => {
    setEditingPost(null);
    setEditingPostFile(null);
  };

  if (!profile || !profile.user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      {/* PROFILE HEADER */}
      <div className="profile-header">
        <img
          src={preview || profile.avatarUrl || "https://picsum.photos/150"}
          alt="profile"
          className="profile-avatar"
        />
        <div className="profile-info">
          <div className="profile-top">
            <h2 className="username">{profile.user.username}</h2>
            {isMyProfile ? (
              <button className="edit-btn" onClick={() => setEditing(!editing)}>
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            ) : (
              <button className="edit-btn" onClick={toggleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          {editing && isMyProfile && (
            <div className="edit-form">
              <label className="avatar-label">Profile Picture / Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="avatar-input"
              />
              <input
                type="text"
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <div className="edit-buttons">
                <button onClick={handleSave} className="save-btn">
                  Save
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="stats-section">
            <span>
              <strong>{posts.length}</strong> posts
            </span>
            <span>
              <strong>{profile.followersCount || 0}</strong> followers
            </span>
            <span>
              <strong>{profile.followingCount || 0}</strong> following
            </span>
          </div>
          <div className="bio">{profile.bio}</div>
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <img src={post.imageUrl} alt="post" />
            {isMyProfile && (
              <div className="post-hover-actions">
                <button
                  className="post-edit-btn"
                  onClick={() => {
                    setEditingPost(post);
                    setEditingPostFile(null);
                    setEditingPostCaption(post.content || "");
                  }}
                >
                  Edit
                </button>

                <button
                  className="post-delete-btn"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* POST EDIT MODAL */}
      {editingPost && (
        <div className="edit-post-modal">
          <h3>Edit Post</h3>
          <img
            src={
              editingPostFile
                ? URL.createObjectURL(editingPostFile)
                : editingPost.imageUrl
            }
            alt="preview"
            className="edit-post-preview"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditingPostFile(e.target.files[0])}
          />
          <textarea
            placeholder="Edit caption"
            value={editingPostCaption}
            onChange={(e) => setEditingPostCaption(e.target.value)}
            className="edit-post-caption"
            style={{
              background: "#111",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "0.3rem",
              width: "100%",
              resize: "none",
            }}
          />
          <div className="edit-buttons">
            <button onClick={handleSavePostEdit} className="save-btn">
              Save
            </button>
            <button onClick={handleCancelPostEdit} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
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
