// Importing modules
const ApiError = require("../utils/ApiError.util");
const HTTP_STATUS = require("../constants/StatusCodes.constants");

// class for Forbidden error
class Forbidden extends ApiError {

    // constructor to initialize the error class
    constructor(message = "Access Forbidden") {

        // calling the parent class constructor
        super(HTTP_STATUS.FORBIDDEN, message);

        // setting the message for the error
        this.message = message;

    }

}

module.exports = Forbidden;
