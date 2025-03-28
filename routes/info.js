// Import required modules
const express = require("express");
const { body } = require("express-validator");

// Import custom controller
const infoController = require("../controllers/info");

// Initialize Express router
const router = express.Router();

// Route: GET /info/about-us
// Description: Render the "About Us" page
router.get("/about-us", infoController.getAboutUs);

// Route: GET /info/contact-us
// Description: Render the "Contact Us" page
router.get("/contact-us", infoController.getContactUs);

// Route: POST /info/send-contact-us-message
// Description: Handle the submission of the "Contact Us" form
router.post(
  "/send-contact-us-message",
  [
    // Validate name
    body("name").isString().notEmpty().withMessage("Name is required."),

    // Validate and sanitize email
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),

    // Validate message
    body("message").isString().notEmpty().withMessage("Message is required."),
  ],
  infoController.postSendContactUsMessage
);

// Export the router for use in the main app
module.exports = router;
