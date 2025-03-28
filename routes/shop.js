// Import required modules
const express = require("express");

// Import custom controllers and middleware
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

// Initialize Express router
const router = express.Router();

// Route: GET /
// Description: Render the shop homepage
router.get("/", shopController.getIndex);

// Route: GET /products
// Description: Render the list of all products
router.get("/products", shopController.getProducts);

// Route: GET /products/:productId
// Description: Render the details of a specific product
router.get("/products/:productId", shopController.getProduct);

// Route: GET /cart
// Description: Render the user's cart (requires authentication)
router.get("/cart", isAuth, shopController.getCart);

// Route: POST /cart
// Description: Add a product to the user's cart (requires authentication)
router.post("/cart", isAuth, shopController.postCart);

// Route: POST /cart-delete-item
// Description: Remove a product from the user's cart (requires authentication)
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

// Route: GET /checkout
// Description: Render the checkout page (requires authentication)
router.get("/checkout", isAuth, shopController.getCheckout);

// Route: GET /checkout/success
// Description: Handle successful checkout (e.g., after payment)
router.get("/checkout/success", shopController.getCheckoutSuccess);

// Route: GET /checkout/cancel
// Description: Handle canceled checkout (e.g., if payment fails)
router.get("/checkout/cancel", shopController.getCheckout);

// Route: GET /orders
// Description: Render the user's orders (requires authentication)
router.get("/orders", isAuth, shopController.getOrders);

// Route: GET /orders/:orderId
// Description: Serve the invoice for a specific order (requires authentication)
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

// Export the router for use in the main app
module.exports = router;
