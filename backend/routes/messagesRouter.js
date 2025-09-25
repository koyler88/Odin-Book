const { Router } = require("express");
const messagesRouter = Router();
const passport = require("passport");
const messagesController = require("../controllers/messagesController");

// Protect all message routes with JWT
messagesRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  messagesController.getMessages
);

messagesRouter.get(
  "/conversations/:userId",
  passport.authenticate("jwt", { session: false }),
  messagesController.getConversation
);

messagesRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  messagesController.createMessage
);

messagesRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  messagesController.deleteMessage
);

module.exports = messagesRouter;
