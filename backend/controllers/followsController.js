const db = require("../db/queries");

const followUser = async (req, res) => {
  try {
    const followingId = Number(req.params.id);
    const followerId = req.user.id;

    const follow = await db.createFollow(followerId, followingId);
    res.status(200).json(follow);
  } catch (err) {
    res.status(500).json({ error: "Failed to follow user" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const followingId = Number(req.params.id);
    const followerId = req.user.id;

    await db.deleteFollow(followerId, followingId);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to unfollow user" });
  }
};

const isFollowing = async (req, res) => {
  try {
    const followingId = Number(req.params.id);
    const followerId = req.user.id;

    const follow = await db.getFollow(followerId, followingId);
    res.status(200).json({ isFollowing: !!follow });
  } catch (err) {
    res.status(500).json({ error: "Failed to check follow status" });
  }
};

module.exports = { followUser, unfollowUser, isFollowing };
