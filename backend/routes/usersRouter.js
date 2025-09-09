const { Router } = require("express");
const usersRouter = Router();

const usersController = require("../controllers/usersController");

usersRouter.get("/:id/profile", usersController.getUserProfile);

module.exports = usersRouter;
