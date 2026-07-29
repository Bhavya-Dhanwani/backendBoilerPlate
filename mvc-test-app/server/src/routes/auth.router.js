// Importing modules
const express = require("express");
const { signup, login, me, logout } = require("./auth.controller");
const { signupValidators, loginValidators } = require("./auth.validator");
const authMiddleware = require("../../../shared/middlewares/auth.middleware");

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
    @route POST /api/auth/logout
    @desc Logout user
    @access Public
*/
router.post("/logout", authMiddleware, logout);

// exporting the router
module.exports = router;
