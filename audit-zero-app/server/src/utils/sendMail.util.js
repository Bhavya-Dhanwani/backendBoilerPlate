// Importing modules
const transporter = require("../config/mail.config");
const logger = require("../config/logger.config");
const env = require("../config/env.config");

// function to send the mails
function sendMail(to, subject, html) {
    if (env.SEND_MAIL) {
        transporter.sendMail({
            from: env.SENDING_USER || "noreply@example.com",
            to,
            subject,
            html
        });
    } else {
        logger.info(`[Mail Mock Log] To: ${to} | Subject: ${subject} | HTML: ${html}`);
    }
}

module.exports = sendMail;
