const mongoose = require("mongoose");

// Destructure Schema from mongoose for cleaner code
const { Schema } = mongoose;

/**
 * Product Schema definition.
 * Represents a product in the database.
 */
const productSchema = new Schema(
  {
    // Title of the product
    title: {
      type: String,
      required: [true, "Product title is required."],
      trim: true, // Remove leading/trailing whitespace
    },

    // Price of the product
    price: {
      type: Number,
      required: [true, "Product price is required."],
      min: [0, "Price cannot be negative."], // Ensure price is non-negative
    },

    // Description of the product
    description: {
      type: String,
      required: [true, "Product description is required."],
      trim: true, // Remove leading/trailing whitespace
    },

    // URL of the product image
    imageUrl: {
      type: String,
      required: [true, "Product image URL is required."],
      trim: true, // Remove leading/trailing whitespace
    },

    // User who created the product
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "User ID is required."],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Product model
module.exports = mongoose.model("Product", productSchema);
