const mongoose = require("mongoose");

// Destructure Schema from mongoose for cleaner code
const { Schema } = mongoose;

/**
 * Order Schema definition.
 * Represents an order in the database.
 */
const orderSchema = new Schema(
  {
    // Array of products in the order
    products: [
      {
        product: {
          type: Object, // Embedded product details
          required: [true, "Product details are required."],
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required."],
          min: [1, "Quantity must be at least 1."],
        },
      },
    ],

    // User who placed the order
    user: {
      email: {
        type: String,
        required: [true, "User email is required."],
        trim: true, // Remove leading/trailing whitespace
        lowercase: true, // Store email in lowercase
      },
      userId: {
        type: Schema.Types.ObjectId,
        required: [true, "User ID is required."],
        ref: "User", // Reference to the User model
      },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Order model
module.exports = mongoose.model("Order", orderSchema);
