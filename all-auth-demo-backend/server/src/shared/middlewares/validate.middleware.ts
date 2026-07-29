// Importing modules
import BadRequest from "../errors/BadRequest.error.js";

// function to validate incoming requests
function validate(schema: any) {
    return (req: any, res: any, next: any) => {
        if (!schema) return next();
        const result = schema.safeParse ? schema.safeParse(req.body) : { success: true };
        if (!result.success) {
            throw new BadRequest("Validation failed");
        }
        next();
    };
}

export default validate;
