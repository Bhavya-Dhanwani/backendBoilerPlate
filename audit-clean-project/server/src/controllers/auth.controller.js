// Importing modules
const env = require("../shared/config/env.config");
const { OTP_EXPIRY_TIME, RESET_PASSWORD_TOKEN_EXPIRY_TIME } = require("../shared/constants/tokens.constants");
const { createUser, findUserByEmail, findUserById, updateUserById } = require("../shared/dao/user.dao");
const { createSession: createSessionInDb, findSessionByRefreshTokenandSessionId, deleteSessionByRefreshTokenandSessionId, deleteSessionByUserId } = require("../shared/dao/session.dao");
const { createToken, findTokenByValue, deleteTokenByValue, deleteTokenByEmail } = require("../shared/dao/token.dao");
const NotFound = require("../shared/errors/NotFound.error");
const Unauthorized = require("../shared/errors/Unauthorized.error");
const Created = require("../shared/responses/Created.response");
const Ok = require("../shared/responses/Ok.response");
const createSession = require("../shared/utils/createSession.util");
const { getGoogleAuthorizationUrl, getGoogleUserFromCode, verifyGoogleToken } = require("../shared/utils/googleAuth.util");
const sendMail = require("../shared/utils/sendMail.util");
const { generateOTPToken, generateResetPasswordToken } = require("../shared/utils/token.util");

// function to signup a new user
async function signup(req, res) {
    const { name, email, password, token } = req.body;
    const user = await createUser({
        name,
        email,
        password,
        providers: ["local"],
        isVerified: token ? true : false,
    });

    const { sanitizedUser, accessToken } = await createSession(user, res);

    const otp = generateOTPToken();
    await createToken({
        email: user.email,
        type: "otp",
        value: otp,
        expiresAt: new Date(Date.now() + OTP_EXPIRY_TIME),
    });

    sendMail(user.email, "Verify your email", `Your OTP is ${otp}. It will expire in ${OTP_EXPIRY_TIME / 60000} minutes.`);

    return Created(res, "Otp Sent Successfully for verification", { user: sanitizedUser, accessToken });
}

// function to login an existing user
async function login(req, res) {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) throw new NotFound("User not found");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Unauthorized("Invalid email or password");

    const { sanitizedUser, accessToken } = await createSession(user, res);
    return Ok(res, "User Logged in Successfully", { user: sanitizedUser, accessToken });
}

// function to get authenticated user profile
async function me(req, res) {
    return Ok(res, "User profile fetched successfully", { user: req.user });
}

// function to refresh access token
async function refresh(req, res) {
    const { session, refreshToken } = req;
    if (!session || !refreshToken) throw new Unauthorized("Session expired or invalid");
    const dbSession = await findSessionByRefreshTokenandSessionId(refreshToken, session.sessionId);
    if (!dbSession) throw new Unauthorized("Session expired or invalid");
    const { sanitizedUser, accessToken } = await createSession(dbSession.userId, res);
    await deleteSessionByRefreshTokenandSessionId(refreshToken, session.sessionId);
    return Ok(res, "Token refreshed successfully", { user: sanitizedUser, accessToken });
}

// function to logout user
async function logout(req, res) {
    const { session, refreshToken } = req;
    if (refreshToken && session) {
        await deleteSessionByRefreshTokenandSessionId(refreshToken, session.sessionId);
    }
    res.clearCookie("refreshToken");
    return Ok(res, "Logged out successfully");
}

// function to logout user from all active sessions
async function logoutAll(req, res) {
    const userId = req.user?._id || req.user?.userId;
    await deleteSessionByUserId(userId);
    res.clearCookie("refreshToken");
    return Ok(res, "Logged out from all sessions successfully");
}

async function googleLogin(req, res) {
    const { credential } = req.body;
    const googleUser = await verifyGoogleToken(credential);
    let user = await findUserByEmail(googleUser.email);
    if (user) {
        if (!user.providers.includes("google")) {
            user = await updateUserById(user._id, { $addToSet: { providers: "google" }, googleId: googleUser.googleId });
        }
    } else {
        user = await createUser({ name: googleUser.name, email: googleUser.email, providers: ["google"], googleId: googleUser.googleId, isVerified: true });
    }
    const { sanitizedUser, accessToken } = await createSession(user, res);
    return Ok(res, "User Logged in Successfully via Google", { user: sanitizedUser, accessToken });
}

function googleRedirect(req, res) {
    const state = generateResetPasswordToken(32);
    res.cookie("googleOAuthState", state, { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "lax", maxAge: 10 * 60 * 1000 });
    let clientOrigin = env.FRONTEND_URL;
    if (req.headers.referer) { try { clientOrigin = new URL(req.headers.referer).origin; } catch (err) {} }
    res.cookie("googleOAuthOrigin", clientOrigin, { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "lax", maxAge: 10 * 60 * 1000 });
    return res.redirect(getGoogleAuthorizationUrl(state));
}

async function googleCallback(req, res) {
    const { code, state, error } = req.query;
    const cookies = req.cookies;
    const clientOrigin = cookies?.googleOAuthOrigin || env.FRONTEND_URL;
    const redirectToLogin = `${clientOrigin}/login?googleError=1`;
    const isStateValid = state && state === cookies?.googleOAuthState;
    if (error || !code || !state || (!isStateValid && env.NODE_ENV === "production")) {
        res.clearCookie("googleOAuthState"); res.clearCookie("googleOAuthOrigin"); return res.redirect(redirectToLogin);
    }
    res.clearCookie("googleOAuthState"); res.clearCookie("googleOAuthOrigin");
    const googleUser = await getGoogleUserFromCode(code);
    let user = await findUserByEmail(googleUser.email);
    if (user && !user.providers.includes("google")) {
        user = await updateUserById(user._id, { $addToSet: { providers: "google" }, googleId: googleUser.googleId, isVerified: true });
    } else if (!user) {
        user = await createUser({ name: googleUser.name, email: googleUser.email, providers: ["google"], googleId: googleUser.googleId, isVerified: true });
    }
    await createSession(user, res);
    return res.redirect(`${clientOrigin}/dashboard`);
}

async function forgotPassword(req, res) {
    const { email } = req.body;
    await deleteTokenByEmail(email, "reset");
    const resetToken = generateResetPasswordToken();
    await createToken({ email: email, type: "reset", value: resetToken, expiresAt: new Date(Date.now() + RESET_PASSWORD_TOKEN_EXPIRY_TIME) });
    sendMail(email, "Your reset Password Link", `Click the link and reset your password <a href="${env.FRONTEND_URL}/reset-password/${resetToken}">Reset Your Password</a>`);
    return Ok(res, "Reset password Mail sent Successfully");
}

async function resetPassword(req, res) {
    const { token, password } = req.body;
    const resetToken = await findTokenByValue(token);
    if (!resetToken) throw new NotFound("Reset token not found.");
    const user = await findUserByEmail(resetToken.email);
    user.password = password;
    await user.save();
    await deleteTokenByValue(token);
    return Ok(res, "Password reset Successfully");
}

module.exports = { signup, login, me, logout, refresh, logoutAll, googleLogin, googleRedirect, googleCallback, forgotPassword, resetPassword };
