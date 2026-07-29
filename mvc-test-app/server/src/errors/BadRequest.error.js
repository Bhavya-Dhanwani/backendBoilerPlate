// Importing modules
const ApiError = require("../utils/ApiError.util");
const HTTP_STATUS = require("../constants/StatusCodes.constants");

// class for BadRequest error
class BadRequest extends ApiError {

    // constructor to initialize the error class
    constructor(message = "Bad Request") {

        // calling the parent class constructor
        super(HTTP_STATUS.BAD_REQUEST, message);

        // setting the message for the error
        this.message = message;

    }

}

module.exports = BadRequest;
