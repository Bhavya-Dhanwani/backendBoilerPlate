// Importing modules
import NotFound from "../errors/NotFound.error.js";

// function to handle not found errors in the application
function notFoundHandler(req: any, res: any, next: any) {

    // throwing a not found error with message
    throw new NotFound("Resource not found");

}

export default notFoundHandler;
