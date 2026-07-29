// Importing modules
const logger = require("../config/logger.config");

// function to handle errors in the application
function errorHandler(err, req, res, next) {

    // logging the error
    logger.error(err);

    // sending the error response with status code and message
    return res.status(err.statusCode || 500).json({
        success: false,
        status: err.statusCode || 500,
        message: err.message || "Internal Server Error"
    });

}

module.exports = errorHandler;
