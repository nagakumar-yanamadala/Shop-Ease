const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isUser: { type: Boolean, default: false },
  isSeller: { type: Boolean, default: false },
  loginType: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  Cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  Orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  // --- UPDATED ADDRESS SCHEMA ---
  address: [
    {
      name: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String, required: true },
      phone: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);