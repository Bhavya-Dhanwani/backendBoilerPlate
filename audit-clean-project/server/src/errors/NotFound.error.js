// Importing modules
const ApiError = require("../utils/ApiError.util");
const HTTP_STATUS = require("../constants/StatusCodes.constants");

// class for NotFound error
class NotFound extends ApiError {

    // constructor to initialize the error class
    constructor(message = "Resource Not Found") {

        // calling the parent class constructor
        super(HTTP_STATUS.NOT_FOUND, message);

        // setting the message for the error
        this.message = message;

    }

}

module.exports = NotFound;
