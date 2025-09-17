require("dotenv").config();
const express = require("express");
const app = express();
const configurePassport = require("./config/passport");
const passport = require("passport");

const PORT = process.env.PORT || 3000;

// Routers
const authRouter = require("./routes/authRouter");
const postsRouter = require("./routes/postsRouter");
const usersRouter = require("./routes/usersRouter");
const messagesRouter = require("./routes/messagesRouter");

// cors allow frontend
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport setup
configurePassport(passport);
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
