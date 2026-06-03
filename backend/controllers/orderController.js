const Order = require('../models/ordersModel');

const orderController = {
  createOrder: async (req, res) => {
    try {
      const {
        buyerId,
        sellerId,
        items,
        shippingAddress,
        totalAmount,
        shippingFee,
        paymentMethod
      } = req.body;


      if (!buyerId || !sellerId || !items || items.length === 0) {
        return res.status(400).json({ message: 'Missing required order details.' });
      }

      const newOrder = new Order({
        buyerId,
        sellerId,
        items,
        shippingAddress,
        totalAmount,
        shippingFee,
        paymentMethod,
        paymentStatus: 'Pending',
      });

      const savedOrder = await newOrder.save();

    
      res.status(201).json({
        message: 'Order placed successfully',
        order: savedOrder,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  getBuyerOrders: async (req, res) => {
    try {
      const { buyerId } = req.params;

      const orders = await Order.find({ buyerId })
        .populate('items.productId', 'title image category') 
        .populate('sellerId', 'name email') 
        .sort({ dateOfOrder: -1 });

      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching buyer orders:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  getSellerOrders: async (req, res) => {
    try {
      const { sellerId } = req.params;

      const orders = await Order.find({ sellerId })
        .populate('items.productId', 'title image price')
        .populate('buyerId', 'name email') // Helps seller know who bought it
        .sort({ dateOfOrder: -1 });

      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  },

  // 4. Update Order Status (Seller fulfilling the order)
  updateOrderStatus: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { orderStatus, paymentStatus } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update statuses if provided
      if (orderStatus) {
        order.orderStatus = orderStatus;
        // If marked as delivered, automatically update the isDelivered flag
        if (orderStatus === 'Delivered') {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
        }
      }

      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }

      const updatedOrder = await order.save();

      res.status(200).json({
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

module.exports = orderController;