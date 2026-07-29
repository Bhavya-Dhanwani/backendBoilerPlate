// Importing modules
import mongoose from "mongoose";
import { COOKIE_EXPIRY_TIME, REFRESH_TOKEN_COOKIE_OPTIONS } from "../constants/tokens.constants.js";
import { generateAccessToken, generateRefreshToken } from "./token.util.js";
import buildTokenPayload from "./buildTokenPayload.util.js";

// function to create a session and return sanitized user with tokens
async function createSession(user: any, res: any, sessionDao: any) {
    const tokenPayload = await buildTokenPayload(user);
    const sessionId = new mongoose.Types.ObjectId();
    const refreshToken = generateRefreshToken({
        sessionId: sessionId.toString(),
        userId: user._id.toString()
    });

    await sessionDao.createSession({
        _id: sessionId,
        userId: user._id,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + COOKIE_EXPIRY_TIME)
    });

    const accessToken = generateAccessToken(tokenPayload);
    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    return { sanitizedUser: tokenPayload, accessToken };
}

export default createSession;
