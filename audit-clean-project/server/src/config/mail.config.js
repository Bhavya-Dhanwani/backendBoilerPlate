// importing modules
const nodemailer = require("nodemailer");
const env = require("./env.config");

// creating a transporter for sending emails
const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || "smtp.gmail.com",
    port: Number(env.SMTP_PORT || 587),
    auth: {
        user: env.SMTP_USER || "",
        pass: env.SMTP_PASS || ""
    }
});

module.exports = transporter;
