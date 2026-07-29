// Importing modules
import express from "express";
import AuthController from "./auth.controller.js";
import { signupValidators, loginValidators, forgotPasswordValidators, resetPasswordValidators, googleLoginValidators } from "./auth.validator.js";

// making the router
const router = express.Router();

// creating a auth controller instance
const authController = new AuthController();

/*
    @route POST /api/auth/signup
    @desc Signup user
    @access Public
*/
router.post("/signup", signupValidators, authController.signup);

/*
    @route POST /api/auth/login
    @desc Login user
    @access Public
*/
router.post("/login", loginValidators, authController.login);

/*
    @route POST /api/auth/google
    @desc Google token login
    @access Public
*/
router.post("/google", googleLoginValidators, authController.googleLogin);

/*
    @route GET /api/auth/google/redirect
    @desc Redirect to Google OAuth page
    @access Public
*/
router.get("/google/redirect", authController.googleRedirect);

/*
    @route GET /api/auth/google/callback
    @desc Handle Google OAuth callback
    @access Public
*/
router.get("/google/callback", authController.googleCallback);

/*
    @route POST /api/auth/forgot-password
    @desc Request password reset email
    @access Public
*/
router.post("/forgot-password", forgotPasswordValidators, authController.forgotPassword);

/*
    @route POST /api/auth/reset-password
    @desc Reset password using token
    @access Public
*/
router.post("/reset-password", resetPasswordValidators, authController.resetPassword);

/*
    @route POST /api/auth/logout
    @desc Logout user
    @access Public
*/
router.post("/logout", authController.logout);

// exporting the router
export default router;
