// Importing modules
const ApiResponse = require("../utils/ApiResponse.util");
const HTTP_STATUS = require("../constants/StatusCodes.constants");

// function to send the API response
function Ok(res, message = "Operation Successful", data = null) {

    // sending the response with status code, message and data
    return ApiResponse(res, HTTP_STATUS.OK, message, data);

}

module.exports = Ok;
