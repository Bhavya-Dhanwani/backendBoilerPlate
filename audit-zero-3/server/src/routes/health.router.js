// Importing modules
const express = require("express");
const Ok = require("../responses/Ok.response");

// Making the express router
const router = express.Router();

/*
    @route GET /api/health
    @desc checks server health
    @access Public
*/
router.get("/", (req, res) => {

    // sending Ok as response
    return Ok(res, "Server is healthy", {
        status: "UP",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });

});

// exporting the router
module.exports = router;
