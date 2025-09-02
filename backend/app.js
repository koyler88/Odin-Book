require('dotenv').config()
const express = require('express')
const app = express();

const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello there!")
})

app.listen(PORT, () => console.log(`backend running on port ${PORT}`))