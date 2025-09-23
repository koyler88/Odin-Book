import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createPost } from "../api/posts";
import "../styles/CreatePost.css";

export default function CreatePost() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  useEffect(() => {
    // cleanup objectURL to avoid memory leaks
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
      formData.append("content", caption);
      formData.append("image", file);

      await createPost(formData, token);
      navigate("/feed");
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
        {/* Image preview */}
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="preview" />
          </div>
        )}

        {/* File input */}
        <label htmlFor="file-upload" className="file-label">
          {file ? file.name : "Click to upload an image"}
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="caption-input"
        />

        {/* Submit */}
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
