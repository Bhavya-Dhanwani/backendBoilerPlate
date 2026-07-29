// Importing modules
const NotFound = require("../errors/NotFound.error");

// function to handle not found errors in the application
function notFoundHandler(req, res, next) {

    // throwing a not found error with message
    throw new NotFound("Resource not found");

}

module.exports = notFoundHandler;
