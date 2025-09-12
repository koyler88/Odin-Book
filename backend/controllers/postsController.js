const db = require("../db/queries");

const getAllPosts = async (req, res) => {
  try {
    const posts = await db.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const posts = await db.getPostsByUserId(userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user's posts" });
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

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Fetch the existing post
    const existingPost = await db.getPostById(Number(postId));
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ownership check
    if (existingPost.authorId !== req.user.id) {
      return res.status(403).json({ error: "You cannot delete this post" });
    }

    // Perform deletion
    await db.deletePost(Number(postId));
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

const getFollowingFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await db.getPostsFromFollowedUsers(userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch following feed" });
  }
};

module.exports = {
  getAllPosts,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
  getFollowingFeed,
};
