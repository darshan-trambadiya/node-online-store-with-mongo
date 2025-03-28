// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const fs = require("fs");
const nodemailer = require("nodemailer");

/**
 * Creates and returns a nodemailer transport instance for sending emails.
 * Uses Mailtrap for testing purposes.
 * @returns {nodemailer.Transporter} - Nodemailer transport instance
 */
exports.getNodemailerTransport = () => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io", // Mailtrap SMTP host
    port: 2525, // Mailtrap SMTP port
    auth: {
      user: process.env.MAIL_TRAP_USERNAME, // Mailtrap username from environment variables
      pass: process.env.MAIL_TRAP_PASSWORD, // Mailtrap password from environment variables
    },
  });
};

/**
 * Deletes a file from the filesystem.
 * @param {string} filePath - The path to the file to be deleted
 * @throws {Error} - If the file deletion fails
 */
exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      throw new Error(`Failed to delete file: ${err.message}`);
    }
  });
};
