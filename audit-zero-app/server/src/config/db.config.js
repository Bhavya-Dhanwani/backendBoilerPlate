// Importing modules
const mongoose = require("mongoose");
const env = require("./env.config");
const logger = require("./logger.config");

// function to connect to the database
async function connectDB() {

    try {

        // connecting to the database
        await mongoose.connect(env.MONGO_URI);
        logger.info("Connected to the database");

    }
    catch (error) {

        // logging the error
        logger.error(error, "Error connecting to the database");

    }

}

module.exports = connectDB;
