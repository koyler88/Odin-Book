const db = require("../db/queries");
const { cloudinary } = require("../config/cloudinary");
const fs = require("fs");

const getUserProfile = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const profile = await db.getProfileByUserId(userId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const getMyProfile = async (req, res) => {
  try {
    let profile = await db.getProfileByUserId(req.user.id);
    if (!profile) profile = await db.createProfile(req.user.id);
    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const updatedProfile = await db.updateProfile(req.user.id, req.body);
    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profiles",
      public_id: `user_${req.user.id}_avatar`,
      overwrite: true,
    });

    fs.unlinkSync(req.file.path); // remove temp file

    const updatedProfile = await db.updateProfile(req.user.id, { avatarUrl: result.secure_url });
    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: "Username query required" });
    const users = await db.findUsersByUsername(username);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search users" });
  }
};

module.exports = {
  getUserProfile,
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  searchUsers,
};
