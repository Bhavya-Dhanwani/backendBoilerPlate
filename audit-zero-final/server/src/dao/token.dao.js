// Importing modules
const Token = require("../models/token.model");

async function createToken(tokenData) {
    const token = await Token.create(tokenData);
    return token;
}

async function findTokenByValue(value) {
    const token = await Token.findOne({ value: value });
    return token;
}

async function deleteTokenByValue(value) {
    const result = await Token.deleteOne({ value: value });
    return result;
}

async function deleteTokenByEmail(email, type) {
    const result = await Token.deleteMany({ email: email, type: type });
    return result;
}

module.exports = { createToken, findTokenByValue, deleteTokenByValue, deleteTokenByEmail };
