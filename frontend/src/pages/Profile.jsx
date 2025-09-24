import "../styles/Profile.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function Profile() {
  const { user } = useAuth();
  const { id } = useParams();
  const isMyProfile = !id || Number(id) === user.id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ bio: "", location: "", avatarFile: null });
  const [preview, setPreview] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

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

  const handleSave = async () => {
    try {
      // Update bio/location first
      const res = await axios.put(
        "http://localhost:3000/users/me",
        { bio: formData.bio, location: formData.location },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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
    setPreview(URL.createObjectURL(file)); // temporary preview in top-left
  };

  const handleCancel = () => {
    setFormData({ ...formData, avatarFile: null });
    setPreview(profile.avatarUrl || ""); // revert top-left PFP
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
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile || !profile.user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
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

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <img src={post.imageUrl} alt="post" />
          </div>
        ))}
      </div>
    </div>
  );
}
