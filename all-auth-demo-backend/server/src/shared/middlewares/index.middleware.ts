// Importing modules
import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import env from "../config/env.config.js";

// function to apply middlewares to the app
function applyMiddlewares(app: any) {

    // applying middlewares
    app.use(compression());

    app.use(cors());

    app.use(helmet());

    app.use(cookieParser());

    app.use(express.json({ limit: "100kb" }));

    app.use(express.urlencoded({ extended: true, limit: "100kb" }));

}

export default applyMiddlewares;
