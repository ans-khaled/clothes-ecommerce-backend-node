const Order = require("../models/order");
const Product = require("../models/product");

const createOrder = async (req, res) => {
  try {
    console.log("User from token:", req.userInfo);
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required to place an order",
      });
    }

    let orderProducts = [];
    let totalPrice = 0;

    // Loop over products comes from client to calc total price
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      // get price from DB
      const price = product.price;
      const quantity = item.quantity;

      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product ${product.name}. Available: ${product.stock}`,
        });
      }

      orderProducts.push({
        productId: product._id,
        quantity,
        price,
      });

      totalPrice += price * quantity;

      product.stock -= quantity;
      await product.save();
    }

    const order = new Order({
      user: req.userInfo.id, // comes from authMiddleware
      products: orderProducts,
      totalPrice,
    });
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error while creating order: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.productId", "name price");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "There are no orders available yet",
      });
    }

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error while getting orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get single order (User or Admin)
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("products.productId", "name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // to make sure this orders own to the user
    if (
      req.userInfo.role !== "admin" &&
      order.user._id.toString() !== req.userInfo.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      messae: `order with id ${orderId} fetched successfully`,
      data: order,
    });
  } catch (error) {
    console.error("Error getting order:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status || order.status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated successfully to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete order (Admin)
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
