// Importing modules
const ApiResponse = require("../utils/ApiResponse.util");
const HTTP_STATUS = require("../constants/StatusCodes.constants");

// function to send the API response
function NoContent(res, message = "No Content", data = null) {

    // sending the response with status code, message and data
    return ApiResponse(res, HTTP_STATUS.NO_CONTENT, message, data);

}

module.exports = NoContent;
