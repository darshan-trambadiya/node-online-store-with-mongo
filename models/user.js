const mongoose = require("mongoose");

// Destructure Schema from mongoose for cleaner code
const { Schema } = mongoose;

/**
 * User Schema definition.
 * Represents a user in the database.
 */
const userSchema = new Schema(
  {
    // User's email address
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true, // Ensure email is unique
      trim: true, // Remove leading/trailing whitespace
      lowercase: true, // Store email in lowercase
    },

    // User's password (hashed)
    password: {
      type: String,
      required: [true, "Password is required."],
    },

    // Token for password reset functionality
    resetToken: String,

    // Expiration date for the password reset token
    resetTokenExpiration: Date,

    // User's shopping cart
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product", // Reference to the Product model
            required: [true, "Product ID is required."],
          },
          quantity: {
            type: Number,
            required: [true, "Quantity is required."],
            min: [1, "Quantity must be at least 1."],
          },
        },
      ],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

/**
 * Adds a product to the user's cart.
 * @param {Object} product - The product to add to the cart
 * @returns {Promise} - Saves the updated user document
 */
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    (cp) => cp.productId.toString() === product._id.toString()
  );

  const updatedCartItems = [...this.cart.items];
  let newQuantity = 1;

  if (cartProductIndex >= 0) {
    // If the product already exists in the cart, increment its quantity
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    // If the product is not in the cart, add it
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  // Update the cart and save the user document
  this.cart.items = updatedCartItems;
  return this.save();
};

/**
 * Removes a product from the user's cart.
 * @param {string} productId - The ID of the product to remove
 * @returns {Promise} - Saves the updated user document
 */
userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  // Update the cart and save the user document
  this.cart.items = updatedCartItems;
  return this.save();
};

/**
 * Clears the user's cart.
 * @returns {Promise} - Saves the updated user document
 */
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

// Create and export the User model
module.exports = mongoose.model("User", userSchema);
