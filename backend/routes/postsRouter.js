const { Router } = require("express");
const postsRouter = Router();

const passport = require("passport");

const postsController = require("../controllers/postsController");

postsRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  postsController.getAllPosts
);

postsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postsController.createPost
);

postsRouter.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  postsController.updatePost
);

module.exports = postsRouter;
