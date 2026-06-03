const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// NOTE: In a production environment, you should protect these routes with authentication middleware.
// Example: router.post('/', requireAuth, orderController.createOrder);

// POST /api/orders
// Create a new order (Triggered when user clicks "Pay Now")
router.post('/', orderController.createOrder);

// GET /api/orders/buyer/:buyerId
// Fetch all orders placed by a specific user
router.get('/buyer/:buyerId', orderController.getBuyerOrders);

// GET /api/orders/seller/:sellerId
// Fetch all orders received by a specific seller
router.get('/seller/:sellerId', orderController.getSellerOrders);

// PATCH /api/orders/:orderId/status
// Update order/payment status (Triggered by seller changing status to "Shipped", etc.)
router.patch('/:orderId/status', orderController.updateOrderStatus);

module.exports = router;