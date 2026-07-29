// Importing modules 
const User = require("../models/user.model");

// function to create a new user
async function createUser(userData) {
    const user = await User.create(userData);
    return user;
}

// function to find a user by email
async function findUserByEmail(email) {
    return await User.findOne({ email });
}

// function to find a user by id
async function findUserById(id) {
    return await User.findById(id);
}

// function to update a user by id
async function updateUserById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
}

// function to delete a user by id
async function deleteUserById(id) {
    return await User.findByIdAndDelete(id);
}

module.exports = { createUser, findUserByEmail, findUserById, updateUserById, deleteUserById };
