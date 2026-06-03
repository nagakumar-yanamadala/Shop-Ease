const express = require('express');
const userRoutes = express.Router();
const {
  getProducts,
  addProduct,
  updateProduct, // <-- Import update
  deleteProduct  // <-- Import delete
} = require('../controllers/productsController');

const {
  toggleFavourites,
  getFavourites,
  toggleCart,
  getCart,
  getAddresses,
  addAddress,
  updateProfile
} = require('../controllers/userController');

userRoutes.get('/products', getProducts);
userRoutes.post('/product', addProduct);

// --- NEW ROUTES FOR EDIT AND DELETE ---
userRoutes.put('/product/:id', updateProduct);
userRoutes.delete('/product/:id', deleteProduct);

userRoutes.post('/favourites/:id', toggleFavourites);
userRoutes.get('/favourites', getFavourites);
userRoutes.get('/cart', getCart);
userRoutes.post('/addtocart/:id', toggleCart);
userRoutes.get('/address', getAddresses);
userRoutes.post('/address', addAddress);
userRoutes.put('/update-profile', updateProfile);

module.exports = userRoutes;