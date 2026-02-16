require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));

app.listen(3000, () => {
    console.log("Auth service rodando");
});
