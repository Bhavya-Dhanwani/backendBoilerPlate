// Importing modules
const express = require("express");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const env = require("../config/env.config");

// function to apply middlewares to the app
function applyMiddlewares(app) {

    // applying middlewares
    app.use(compression());

    app.use(cors());

    app.use(helmet());

    app.use(cookieParser());

    app.use(express.json({ limit: "100kb" }));

    app.use(express.urlencoded({ extended: true, limit: "100kb" }));

}

module.exports = applyMiddlewares;
