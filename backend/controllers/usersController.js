const db = require("../db/queries");

const getUserProfile = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const profile = await db.getProfileByUserId(userId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const getMyProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let profile = await db.getProfileByUserId(req.user.id);

    if (!profile) {
      // Auto-create profile if missing
      try {
        profile = await db.createProfile(req.user.id);
      } catch (err) {
        console.error("Failed to create profile:", err);
        return res.status(500).json({ error: "Failed to create profile" });
      }
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error in getMyProfile:", error);
    res.status(500).json({ error: "Failed to fetch your profile" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const updatedProfile = await db.updateProfile(req.user.id, req.body);
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = {
  getUserProfile,
  getMyProfile,
  updateMyProfile
};
