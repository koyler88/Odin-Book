import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createPost } from "../api/posts";
import "../styles/CreatePost.css";

export default function CreatePost() {
  const { token } = useAuth(); // get token from AuthContext
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim() || !file) {
      setError("Both caption and an image are required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("content", caption); // backend expects "content"
      formData.append("image", file);

      await createPost(formData, token);
      navigate("/feed"); // redirect to feed after posting
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a Post</h2>

      <form className="create-post-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="caption-input"
        />
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
