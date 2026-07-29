// Importing modules
import express, { Express } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import router from "./shared/routers/index.router.js";
import applyMiddlewares from "./shared/middlewares/index.middleware.js";
import notFoundHandler from "./shared/middlewares/NotFound.middleware.js";
import errorHandler from "./shared/middlewares/error.middleware.js";
import { setupSwagger } from "./shared/swagger.js";

// function to make the app
function createApp(): Express {

    // create an express app
    const app = express();

    // applying middlewares
    applyMiddlewares(app);

    // adding the index router to the app
    app.use("/api", router);
    app.use("/health", router);

    // setting up swagger documentation
    setupSwagger(app);

    // not found middleware
    app.use(notFoundHandler);

    // error handling middleware
    app.use(errorHandler);

    // returning the app
    return app;

}

export default createApp;
