// Importing modules
const express = require("express");
const healthRouter = require("./health.router");
const authRouter = require("./auth.router");

// making the router
const router = express.Router();

// mounting the public routers
router.use("/health", healthRouter);
router.use("/auth", authRouter);

// exporting the router
module.exports = router;
