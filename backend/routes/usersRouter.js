const { Router } = require("express");
const usersRouter = Router();

const passport = require("passport");

const usersController = require("../controllers/usersController");
const followsController = require("../controllers/followsController");

usersRouter.get("/:id/profile", usersController.getUserProfile);

usersRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  usersController.getMyProfile
);

usersRouter.put(
  "/me",
  passport.authenticate("jwt", { session: false }),
  usersController.updateMyProfile
);

// Follow/unfollow

usersRouter.post("/:id/follow", followsController.followUser);

usersRouter.delete("/:id/follow", followsController.unfollowUser);

module.exports = usersRouter;
