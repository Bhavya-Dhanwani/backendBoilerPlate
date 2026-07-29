// Importing modules
const ApiError = require("../utils/ApiError.util");
const HTTP_STATUS = require("../constants/StatusCodes.constants");

// class for Conflict error
class Conflict extends ApiError {

    // constructor to initialize the error class
    constructor(message = "Resource Conflict") {

        // calling the parent class constructor
        super(HTTP_STATUS.CONFLICT, message);

        // setting the message for the error
        this.message = message;

    }

}

module.exports = Conflict;
