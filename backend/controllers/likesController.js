const db = require("../db/queries");

const likePost = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const userId = req.user.id;

    const like = await db.addLike({ postId, userId });
    res.status(201).json(like);
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma unique constraint error (already liked)
      return res.status(400).json({ error: "Post already liked" });
    }
    res.status(500).json({ error: "Failed to like post" });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const userId = req.user.id;

    const unlike = await db.removeLike({ postId, userId });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to unlike post" });
  }
};

module.exports = {
  likePost,
  unlikePost,
};
