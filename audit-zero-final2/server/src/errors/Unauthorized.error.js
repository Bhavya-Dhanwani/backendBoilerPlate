// Importing modules
const ApiError = require("../utils/ApiError.util");
const HTTP_STATUS = require("../constants/StatusCodes.constants");

// class for Unauthorized error
class Unauthorized extends ApiError {

    // constructor to initialize the error class
    constructor(message = "Unauthorized Access") {

        // calling the parent class constructor
        super(HTTP_STATUS.UNAUTHORIZED, message);

        // setting the message for the error
        this.message = message;

    }

}

module.exports = Unauthorized;
