const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(cookieParser());

// use some application-level middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// Serve the public folder for public resources
app.use(express.static(path.join(__dirname, "../public")));

// Serve REACT APP
app.use(express.static(path.join(__dirname, "..", "public")));

const router = express.Router();
const userRouter = require("./routes/userRouter");
const realRouter = require("./routes/realRouter");

router.use("/user", userRouter);
router.use("/real", realRouter);

// API routes
app.use("/api", router);

// Redirect all requests to the REACT app
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// ready to export
module.exports = app;
