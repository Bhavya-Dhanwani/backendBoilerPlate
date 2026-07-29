// Importing modules
const mongoose = require("mongoose");
const { COOKIE_EXPIRY_TIME, REFRESH_TOKEN_COOKIE_OPTIONS } = require("../constants/tokens.constants");
const { generateAccessToken, generateRefreshToken } = require("./token.util");
const buildTokenPayload = require("./buildTokenPayload.util");

// function to create a session and return sanitized user with tokens
async function createSession(user, res, sessionDao) {
    const u = user;
    const tokenPayload = await buildTokenPayload(user);
    const sessionId = new mongoose.Types.ObjectId();
    const refreshToken = generateRefreshToken({
        sessionId: sessionId.toString(),
        userId: u._id.toString()
    });

    const sDao = sessionDao;
    await sDao.createSession({
        _id: sessionId,
        userId: u._id,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + COOKIE_EXPIRY_TIME)
    });

    const accessToken = generateAccessToken(tokenPayload);
    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    return { sanitizedUser: tokenPayload, accessToken };
}

module.exports = createSession;
