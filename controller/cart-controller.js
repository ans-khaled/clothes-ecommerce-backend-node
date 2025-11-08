const Cart = require("../models/cart");
const Product = require("../models/product");
const mongoose = require("mongoose");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userInfo.id }).populate(
      "products.productId"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart is fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error while getting cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${productId} not found`,
      });
    }

    // Stock validation
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ productId, quantity, price: product.price }],
        totalPrice: quantity * product.price,
      });
    } else {
      // In case there are cart already (checking product exist in cart or not then update quanitity).
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex > -1) {
        if (cart.products[productIndex].quantity + quantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: `Cannot add more than ${product.stock} items for this product`,
          });
        }

        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity, price: product.price });
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );
    }
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error while adding to cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const productId = req.params.id;

    // validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const productIndex = cart.products.findIndex(
      (cartItem) => cartItem.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Remove product
    cart.products.splice(productIndex, 1);

    // Update total price
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    // delete cart if empty
    if (cart.products.length === 0) {
      await cart.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Cart is now empty and has been removed",
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error while removing from cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const productId = req.params.id;
    const { action } = req.body;

    // validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    // Validate action
    if (!["increase", "decrease"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use 'increase' or 'decrease'",
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (action === "increase") {
      if (cart.products[productIndex].quantity + 1 > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
        });
      }

      cart.products[productIndex].quantity += 1;
    } else if (action === "decrease") {
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }
    }

    cart.totalPrice =
      cart.products.length > 0
        ? cart.products.reduce(
            (acc, item) => acc + item.quantity * item.price,
            0
          )
        : 0;

    await cart.save();

    // Populate cart with product details
    cart = await Cart.findOne({ user: userId }).populate(
      "products.productId",
      "name price image"
    );

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      data: cart,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error("Error while updating quantity:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Not found",
      });
    }

    await Cart.deleteOne({ user: userId });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error while clearing Cart", error.message);
    res.status(500).json({
      success: false,
      message: "Something went error",
      error: error.message,
    });
  }
};

const getSummary = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Not found",
      });
    }

    const totalItems = cart.products.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);

    const productList = cart.products.map((item) => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      subtotal: item.quantity * item.price,
    }));

    res.status(200).json({
      success: true,
      message: "Fetched Cart summary successfully",
      totalItems,
      uniqueProducts: cart.products.length,
      totalPrice: cart.totalPrice,
      products: productList,
    });
  } catch (error) {
    console.error("Error while fetching Cart summary", error.message);
    res.status(500).json({
      success: false,
      message: "Something went error",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  deleteFromCart,
  updateProductQuantity,
  clearCart,
  getSummary,
};
