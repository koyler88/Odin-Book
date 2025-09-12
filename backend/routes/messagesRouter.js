const { Router } = require("express");
const messagesRouter = Router();

const messagesController = require("../controllers/messagesController");

messagesRouter.get("/", messagesController.getMessages);

messagesRouter.get(
  "/conversations/:userId",
  messagesController.getConversation
);

messagesRouter.post("/", messagesController.createMessage);

messagesRouter.delete("/:id", messagesController.deleteMessage);

module.exports = messagesRouter;
