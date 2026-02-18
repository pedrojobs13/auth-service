require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));

module.exports = app;
