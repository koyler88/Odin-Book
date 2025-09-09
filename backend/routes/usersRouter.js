const { Router } = require("express");
const usersRouter = Router();

const passport = require("passport");

const usersController = require("../controllers/usersController");

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

module.exports = usersRouter;
