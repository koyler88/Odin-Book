const { Router } = require("express");
const passport = require("passport");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const usersController = require("../controllers/usersController");
const followsController = require("../controllers/followsController");

const router = Router();

// Profile
router.get("/:id/profile", usersController.getUserProfile);
router.get("/search", usersController.searchUsers);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  usersController.getMyProfile
);

router.put(
  "/me",
  passport.authenticate("jwt", { session: false }),
  usersController.updateMyProfile
);

// Profile avatar upload
router.post(
  "/me/avatar",
  passport.authenticate("jwt", { session: false }),
  upload.single("avatar"),
  usersController.uploadAvatar
);

// Follow/unfollow
router.post("/:id/follow", passport.authenticate("jwt", { session: false }), followsController.followUser);
router.delete("/:id/follow", passport.authenticate("jwt", { session: false }), followsController.unfollowUser);

// Check if following
router.get("/:id/is-following", passport.authenticate("jwt", { session: false }), followsController.isFollowing);

module.exports = router;
