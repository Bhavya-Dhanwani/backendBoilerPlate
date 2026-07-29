// Importing modules
const express = require("express");
const path = require("path");
const { existsSync } = require("fs");
const router = require("./routes/index.router");
const applyMiddlewares = require("./middlewares/index.middleware");
const notFoundHandler = require("./middlewares/NotFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

const serverDirectory = path.resolve(__dirname, "..");
const publicDirectory = path.join(serverDirectory, "public");
const frontendIndex = path.join(publicDirectory, "index.html");

// function to make the app
function createApp() {

    // create an express app
    const app = express();

    // applying middlewares
    applyMiddlewares(app);

    // adding the index router to the app
    app.use("/api", router);

    // API routes must continue returning JSON 404 responses instead of the SPA shell.
    app.use("/api", notFoundHandler);

    // Serve a built frontend copied into server/public, when present.
    if (existsSync(frontendIndex)) {
        app.use(express.static(publicDirectory));

        // Express 5 requires a named wildcard. This lets client-side routes reload correctly.
        app.get("/*path", (req, res) => res.sendFile(frontendIndex));
    }

    // not found middleware
    app.use(notFoundHandler);

    // error handling middleware
    app.use(errorHandler);

    // returning the app
    return app;

}

module.exports = createApp;
