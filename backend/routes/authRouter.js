const { Router } = require("express");
const authRouter = Router();

const authController = require("../controllers/authController");

// Middleware
const { registerValidation } = require("../middleware/authValidator");
const handleValidationErrors = require("../middleware/handleValidationErrors");

authRouter.post('/register', registerValidation, handleValidationErrors, authController.register)

module.exports = authRouter;
