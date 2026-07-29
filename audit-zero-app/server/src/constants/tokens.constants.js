// Importing modules
const env = require("../config/env.config");

const EXPIRY = {
    ACCESS_TOKEN: env.NODE_ENV === "development" ? "5m" : "15m",
    REFRESH_TOKEN: env.NODE_ENV === "development" ? "2h" : "7d",
    SINGLE_TOKEN: "30d",
};

const COOKIE_EXPIRY_TIME = env.NODE_ENV === "development" ? 2 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

const REFRESH_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: COOKIE_EXPIRY_TIME,
};

const SINGLE_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
};

const OTP_EXPIRY_TIME = env.NODE_ENV === "development" ? 5 * 60 * 1000 : 10 * 60 * 1000;

const RESET_PASSWORD_TOKEN_EXPIRY_TIME = env.NODE_ENV === "development" ? 5 * 60 * 1000 : 10 * 60 * 1000;

module.exports = { EXPIRY, COOKIE_EXPIRY_TIME, REFRESH_TOKEN_COOKIE_OPTIONS, SINGLE_TOKEN_COOKIE_OPTIONS, OTP_EXPIRY_TIME, RESET_PASSWORD_TOKEN_EXPIRY_TIME };
