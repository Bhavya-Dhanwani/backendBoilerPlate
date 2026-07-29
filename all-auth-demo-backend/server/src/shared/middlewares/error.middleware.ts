// Importing modules
import logger from "../config/logger.config.js";

// function to handle errors in the application
function errorHandler(err: any, req: any, res: any, next: any) {

    // logging the error
    logger.error(err);

    // sending the error response with status code and message
    return res.status(err.statusCode || 500).json({
        success: false,
        status: err.statusCode || 500,
        message: err.message || "Internal Server Error"
    });

}

export default errorHandler;
