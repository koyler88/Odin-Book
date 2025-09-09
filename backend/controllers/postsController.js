const db = require("../db/queries");

const getAllPosts = async (req, res) => {
  try {
    const posts = await db.getPostsByUserId(req.user.id);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await db.createPost({
      title: req.body.title,
      content: req.body.content,
      authorId: req.user.id,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Fetch the existing post
    const existingPost = await db.getPostById(Number(postId));
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ownership check
    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({ error: "You cannot edit this post" });
    }

    // Perform update
    const updatedPost = await db.updatePost({
      title: req.body.title,
      content: req.body.content,
      postId: Number(postId),
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
};
