const db = require("../db/queries");

const followUser = async (req, res) => {
  try {
    const followingId = Number(req.params.id);
    const followerId = req.user.id;

    if (followingId === followerId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const follow = await db.createFollow(followerId, followingId);
    res.status(201).json(follow);
  } catch (error) {
    res.status(500).json({ error: "Failed to follow user" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const followingId = Number(req.params.id);
    const followerId = req.user.id;

    await db.deleteFollow(followerId, followingId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to unfollow user" });
  }
};

module.exports = {
  followUser,
  unfollowUser,
};
