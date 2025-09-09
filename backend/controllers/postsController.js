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

module.exports = {
  getAllPosts,
  createPost
};
