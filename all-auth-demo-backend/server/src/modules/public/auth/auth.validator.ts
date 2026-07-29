// Importing modules
import { body } from "express-validator";
import validateErrors from "../../../shared/utils/validateErrors.util.js";

const signupValidators = [
    body("name").notEmpty().withMessage("Name is required").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    validateErrors
];

const loginValidators = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
    validateErrors
];

const forgotPasswordValidators = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    validateErrors
];

const resetPasswordValidators = [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    validateErrors
];

const googleLoginValidators = [
    body("credential").notEmpty().withMessage("Google credential is required"),
    validateErrors
];

export { signupValidators, loginValidators, forgotPasswordValidators, resetPasswordValidators, googleLoginValidators };
