require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Routers
const authRouter = require("./routes/authRouter");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello there!");
});

app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
