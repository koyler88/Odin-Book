const { Router } = require("express");
const postsRouter = Router();

const passport = require("passport");

const postsController = require("../controllers/postsController");
const likesController = require("../controllers/likesController");
const commentsRouter = require("./commentsRouter");

const { upload } = require("../config/cloudinary");

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
  upload.single("image"),
  postsController.createPost
);

postsRouter.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postsController.updatePost
);

postsRouter.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postsController.deletePost
);

// Comments

postsRouter.use("/:postId/comments", commentsRouter);

// Likes

postsRouter.post("/:postId/like", passport.authenticate("jwt", {session: false}), likesController.likePost);

postsRouter.delete("/:postId/like", passport.authenticate("jwt", {session: false}), likesController.unlikePost);

// Following feed

postsRouter.get(
  "/following",
  passport.authenticate("jwt", { session: false }),
  postsController.getFollowingFeed
);

module.exports = postsRouter;
