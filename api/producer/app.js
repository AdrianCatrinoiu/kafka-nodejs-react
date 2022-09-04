const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const config = require("./src/config");
const { userRouter, authRouter } = require("./src/routes");
const verifyJWT = require("./src/middleware/verifyJWT");

const app = express();

app.use(cookieParser());

app.use(cors(config.cors));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/auth/", authRouter);

app.use(verifyJWT);
app.use("/users/", userRouter);

module.exports = {
  app,
};
