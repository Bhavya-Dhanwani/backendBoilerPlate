// Importing modules
const pino = require("pino");
const env = require("./env.config");

// creating a logger instance
const logger = pino({
    level: env.NODE_ENV === "production" ? "info" : "debug",
    ...(env.NODE_ENV !== "production" && {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
            },
        },
    }),
});

module.exports = logger;
