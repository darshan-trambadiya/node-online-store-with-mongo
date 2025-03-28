// Import required modules
const express = require("express");
const { body } = require("express-validator");

// Import custom controllers and middleware
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

// Initialize Express router
const router = express.Router();

// Route: GET /admin/add-product
// Description: Render the "Add Product" page
router.get("/add-product", isAuth, adminController.getAddProduct);

// Route: GET /admin/products
// Description: Render the list of products for the admin
router.get("/products", isAuth, adminController.getProducts);

// Route: POST /admin/add-product
// Description: Handle the submission of a new product
router.post(
  "/add-product",
  [
    // Validate and sanitize input fields
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long.")
      .trim(),
    body("price").isFloat().withMessage("Price must be a valid number."),
    body("description")
      .isLength({ min: 5, max: 400 })
      .withMessage("Description must be between 5 and 400 characters.")
      .trim(),
  ],
  isAuth, // Ensure user is authenticated
  adminController.postAddProduct // Handle the request
);

// Route: GET /admin/edit-product/:productId
// Description: Render the "Edit Product" page for a specific product
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// Route: POST /admin/edit-product
// Description: Handle the submission of an edited product
router.post(
  "/edit-product",
  [
    // Validate and sanitize input fields
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long.")
      .trim(),
    body("price").isFloat().withMessage("Price must be a valid number."),
    body("description")
      .isLength({ min: 5, max: 400 })
      .withMessage("Description must be between 5 and 400 characters.")
      .trim(),
  ],
  isAuth, // Ensure user is authenticated
  adminController.postEditProduct // Handle the request
);

// Route: DELETE /admin/product/:productId
// Description: Handle the deletion of a product
router.delete("/product/:productId", isAuth, adminController.deleteProduct);

// Export the router for use in the main app
module.exports = router;
