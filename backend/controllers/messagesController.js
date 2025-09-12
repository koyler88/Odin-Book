const db = require("../db/queries");

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await db.getMessagesForUser(userId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

const getConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const chattingWithId = Number(req.params.userId);

    if (currentUserId === chattingWithId) {
      return res
        .status(400)
        .json({ error: "Cannot fetch conversation with yourself" });
    }

    const conversationMessages = await db.getConversation(
      currentUserId,
      chattingWithId
    );

    if (!conversationMessages.length) {
      return res.status(404).json({ error: "No conversation found" });
    }

    res.json(conversationMessages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};

const createMessage = async (req, res) => {
  try {
    const recipientId = Number(req.body.recipientId);

    if (recipientId === req.user.id) {
      return res.status(400).json({ error: "Cannot send message to yourself" });
    }

    const message = await db.createMessage({
      authorId: req.user.id,
      recipientId: Number(req.body.recipientId),
      content: req.body.content,
    });

    res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: "Failed to send message" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = Number(req.params.id);

    const existingMessage = await db.getMessageById(messageId);

    if (!existingMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (existingMessage.authorId !== req.user.id) {
      return res.status(403).json({ error: "Not allowed to delete this message" });
    }

    await db.deleteMessage(messageId);

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete message" });
  }
};

module.exports = {
  getMessages,
  getConversation,
  createMessage,
  deleteMessage,
};
