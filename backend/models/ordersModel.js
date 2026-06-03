const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel');

const orderSchema = new mongoose.Schema({
  // --- 1. Core Relationships ---
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // --- 2. Product Details ---
  // Using an array allows for multi-item carts. 
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      // IMPORTANT: Store the price at the time of purchase. 
      // If the seller changes the product price later, it shouldn't alter historical order totals.
      priceAtPurchase: {
        type: Number,
        required: true,
      }
    }
  ],

  // --- 3. Delivery & Address ---
  shippingAddress: {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },

  // --- 4. Financials ---
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingFee: {
    type: Number,
    default: 0,
  },

  // --- 5. Payment Information ---
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit/Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'],
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending',
  },

  // --- 6. Fulfillment Status ---
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },

  // --- 7. Dates ---
  dateOfOrder: {
    type: Date,
    default: Date.now,
  },
},
  {
    // Automatically manages 'createdAt' and 'updatedAt' timestamps
    timestamps: true
  });

module.exports = mongoose.model('Order', orderSchema);