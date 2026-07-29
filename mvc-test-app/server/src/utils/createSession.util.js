// Importing modules
const { SINGLE_TOKEN_COOKIE_OPTIONS } = require("../constants/tokens.constants");
const { generateAccessToken } = require("./token.util");
const buildTokenPayload = require("./buildTokenPayload.util");

// function to create a single token and set 30-day cookie
async function createSession(user, res) {
    const tokenPayload = await buildTokenPayload(user);
    const token = generateAccessToken(tokenPayload);
    res.cookie("token", token, SINGLE_TOKEN_COOKIE_OPTIONS);
    return { sanitizedUser: tokenPayload, token };
}

module.exports = createSession;
