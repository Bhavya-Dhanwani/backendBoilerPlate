// Importing modules
const express = require("express");
const { signup, login, me, logout, refresh, logoutAll, googleLogin, googleRedirect, googleCallback, forgotPassword, resetPassword } = require("./auth.controller");
const { signupValidators, loginValidators, forgotPasswordValidators, resetPasswordValidators, googleLoginValidators } = require("./auth.validator");
const authMiddleware = require("../../../shared/middlewares/auth.middleware");
const refreshMiddleware = require("../../../shared/middlewares/refresh.middleware");

// making the router
const router = express.Router();

/*
    @route POST /api/auth/signup
    @desc Signup user
    @access Public
*/
router.post("/signup", signupValidators, signup);

/*
    @route POST /api/auth/login
    @desc Login user
    @access Public
*/
router.post("/login", loginValidators, login);

/*
    @route GET /api/auth/me
    @desc Get authenticated user profile
    @access Private
*/
router.get("/me", authMiddleware, me);

/*
    @route POST /api/auth/refresh
    @desc Refresh access token
    @access Public
*/
router.post("/refresh", refreshMiddleware, refresh);

/*
    @route POST /api/auth/logout
    @desc Logout user
    @access Public
*/
router.post("/logout", refreshMiddleware, logout);

/*
    @route POST /api/auth/logoutall
    @desc Logout user from all active sessions
    @access Private
*/
router.post("/logoutall", authMiddleware, logoutAll);

/*
    @route POST /api/auth/google-login
    @desc Login user via Google
    @access Public
*/
router.post("/google-login", googleLoginValidators, googleLogin);
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);

/*
    @route POST /api/auth/forgot-password
    @desc Forgot password
    @access Public
*/
router.post("/forgot-password", forgotPasswordValidators, forgotPassword);

/*
    @route POST /api/auth/reset-password
    @desc Reset password
    @access Public
*/
router.post("/reset-password", resetPasswordValidators, resetPassword);

// exporting the router
module.exports = router;
