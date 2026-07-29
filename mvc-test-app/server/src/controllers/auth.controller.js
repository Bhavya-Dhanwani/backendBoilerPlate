// Importing modules
const env = require("../shared/config/env.config");
const { createUser, findUserByEmail, findUserById, updateUserById } = require("../shared/dao/user.dao");
const NotFound = require("../shared/errors/NotFound.error");
const Unauthorized = require("../shared/errors/Unauthorized.error");
const Created = require("../shared/responses/Created.response");
const Ok = require("../shared/responses/Ok.response");
const createSession = require("../shared/utils/createSession.util");

// function to signup a new user
async function signup(req, res) {
    const { name, email, password, token } = req.body;
    const user = await createUser({
        name,
        email,
        password,
        isVerified: true,
    });

    const { sanitizedUser, token: authToken } = await createSession(user, res);

    return Created(res, "User signed up successfully", { user: sanitizedUser, token: authToken });
}

// function to login an existing user
async function login(req, res) {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) throw new NotFound("User not found");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Unauthorized("Invalid email or password");

    const { sanitizedUser, token: authToken } = await createSession(user, res);
    return Ok(res, "User Logged in Successfully", { user: sanitizedUser, token: authToken });
}

// function to get authenticated user profile
async function me(req, res) {
    return Ok(res, "User profile fetched successfully", { user: req.user });
}

// function to logout user
async function logout(req, res) {
    res.clearCookie("token");
    return Ok(res, "Logged out successfully");
}

module.exports = { signup, login, me, logout };
