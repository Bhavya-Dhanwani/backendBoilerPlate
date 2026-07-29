// Importing modules
const Session = require("../models/sessions.model");

async function createSession(sessionData) {
    return await Session.create(sessionData);
}

async function findSessionByRefreshTokenandSessionId(refreshToken, sessionId) {
    return await Session.findOne({
        refreshToken: refreshToken,
        _id: sessionId
    }).populate("userId", "-password -__v");
}

async function deleteSessionByRefreshTokenandSessionId(refreshToken, sessionId) {
    return await Session.findOneAndDelete({
        refreshToken: refreshToken,
        _id: sessionId
    });
}

async function deleteSessionByUserId(userId) {
    return await Session.deleteMany({
        userId: userId
    });
}

async function updateSessionByRefreshTokenandSessionId(refreshToken, sessionId, updateData) {
    return await Session.findOneAndUpdate({
        refreshToken: refreshToken,
        _id: sessionId
    }, updateData, { returnDocument: "after" });
}

async function findById(id) {
    return await Session.findById(id).populate("userId");
}

module.exports = { createSession, findSessionByRefreshTokenandSessionId, deleteSessionByRefreshTokenandSessionId, deleteSessionByUserId, updateSessionByRefreshTokenandSessionId, findById };
