const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name slug images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name slug images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0]?.url,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.price
    }));

    // Calculate amounts
    const subtotal = cart.totalAmount;
    const shippingCost = subtotal > 2000 ? 0 : 100; // Free shipping above ₹2000
    const tax = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + shippingCost + tax;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed'
    });

    // Update product stock and sold count
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name slug')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: { orders }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (orderStatus === 'delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};
