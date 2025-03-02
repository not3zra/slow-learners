const express = require("express");
const connectDB = require("./src/config/db");

const app = express();
connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.listen(5000, () => console.log(`Backend is running on port 5000`));
