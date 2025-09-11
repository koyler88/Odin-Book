const db = require("../db/queries");

const getCommentsByPostId = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const comments = await db.getCommentsByPostId(postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

const createComment = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const authorId = req.user.id;
    const { content } = req.body;

    const newComment = await db.createComment({ content, postId, authorId });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment" });
  }
};

const updateComment = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const postId = Number(req.params.postId);
    const { content } = req.body;

    const existingComment = await db.getCommentById(commentId);
    if (!existingComment || existingComment.postId !== postId) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (existingComment.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this comment" });
    }

    const updatedComment = await db.updateComment(commentId, content);
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);

    const existingComment = await db.getCommentById(commentId);
    if (!existingComment || existingComment.postId !== postId) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (existingComment.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }

    await db.deleteComment(commentId);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
};
