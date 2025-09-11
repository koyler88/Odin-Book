const { Router } = require("express");
const commentsRouter = Router({ mergeParams: true });
commentsController = require("../controllers/commentsController");

const passport = require("passport");

commentsRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  commentsController.getCommentsByPostId
);

commentsRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  commentsController.createComment
);

commentsRouter.post(
  "/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentsController.updateComment
);

commentsRouter.delete(
  "/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentsController.deleteComment
);

module.exports = commentsRouter;
