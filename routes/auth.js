// Import required modules
const express = require("express");
const { check, body } = require("express-validator");

// Import custom controllers and models
const authController = require("../controllers/auth");
const User = require("../models/user");

// Initialize Express router
const router = express.Router();

// Route: GET /auth/login
// Description: Render the login page
router.get("/login", authController.getLogin);

// Route: GET /auth/signup
// Description: Render the signup page
router.get("/signup", authController.getSignup);

// Route: POST /auth/login
// Description: Handle user login
router.post(
  "/login",
  [
    // Validate and sanitize email
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),

    // Validate and sanitize password
    body(
      "password",
      "Password must be at least 5 characters long and alphanumeric."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin // Handle the request
);

// Route: POST /auth/signup
// Description: Handle user signup
router.post(
  "/signup",
  [
    // Validate and sanitize email
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        // Check if email already exists in the database
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          throw new Error("E-Mail already exists. Please use a different one.");
        }
      })
      .normalizeEmail(),

    // Validate and sanitize password
    body(
      "password",
      "Password must be at least 5 characters long and alphanumeric."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),

    // Validate password confirmation
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      }),
  ],
  authController.postSignup // Handle the request
);

// Route: POST /auth/logout
// Description: Handle user logout
router.post("/logout", authController.postLogout);

// Route: GET /auth/reset
// Description: Render the password reset page
router.get("/reset", authController.getReset);

// Route: POST /auth/reset
// Description: Handle password reset request
router.post("/reset", authController.postReset);

// Route: GET /auth/reset/:token
// Description: Render the new password page with a valid token
router.get("/reset/:token", authController.getNewPassword);

// Route: POST /auth/new-password
// Description: Handle new password submission
router.post("/new-password", authController.postNewPassword);

// Export the router for use in the main app
module.exports = router;
