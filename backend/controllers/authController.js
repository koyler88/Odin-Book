const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db/queries");
require("dotenv").config();

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await db.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.createUser(username, hashedPassword);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user: { id: user.id, username: user.username },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
    register,

}
