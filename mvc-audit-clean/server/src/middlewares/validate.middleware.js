// Importing modules
const BadRequest = require("../errors/BadRequest.error");

// function to validate incoming requests
function validate(schema) {
    return (req, res, next) => {
        if (!schema) return next();
        const result = schema.safeParse ? schema.safeParse(req.body) : { success: true };
        if (!result.success) {
            throw new BadRequest("Validation failed");
        }
        next();
    };
}

module.exports = validate;
