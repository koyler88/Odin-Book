const { Router } = require("express");
const postsRouter = Router();

const passport = require("passport");

const postsController = require("../controllers/postsController");


// Feed: all posts
postsRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  postsController.getAllPosts
);

// Posts by user
postsRouter.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  postsController.getPostsByUserId
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

postsRouter.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  postsController.deletePost
);

module.exports = postsRouter;
