// Importing modules
import jwt from "jsonwebtoken";
import Unauthorized from "../errors/Unauthorized.error.js";
import Forbidden from "../errors/Forbidden.error.js";
import env from "../config/env.config.js";

// middleware function to authenticate users
export function authenticate(req: any, res: any, next: any) {
    const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        throw new Unauthorized("Authentication token is required");
    }
    try {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        throw new Unauthorized("Invalid or expired authentication token");
    }
}

// middleware function to authorize user roles
export function authorize(...roles: string[]) {
    return (req: any, res: any, next: any) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new Forbidden("Access denied");
        }
        next();
    };
}
