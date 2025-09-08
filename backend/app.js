require("dotenv").config();
const express = require("express");
const app = express();
const configurePassport = require("./config/passport");
const passport = require("passport");

const PORT = process.env.PORT || 3000;

// Routers
const authRouter = require("./routes/authRouter");

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

app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
