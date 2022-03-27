const express = require("express");

const app = express();
const userController = require("../controllers/user.controllers");

app.use(express.json());

app.use("/user", userController);
module.exports = app;

