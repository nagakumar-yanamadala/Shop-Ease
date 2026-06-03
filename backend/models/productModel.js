const mongoose = require('mongoose');
const User = require('./userModel');
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  oldPrice: {
    type: String,
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
  },

  image: {
    type: String,
    required: true,
  },

  sectionTitle: {
    type: String,
    required: true,
  },

  tag: {
    type: String,
  },
  hostId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model('Product', productSchema);