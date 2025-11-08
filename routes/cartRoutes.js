const express = require("express");
const {
  getCart,
  addToCart,
  deleteFromCart,
  updateProductQuantity,
  clearCart,
  getSummary,
} = require("../controller/cart-controller");

const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const authAdminMiddleware = require("../middleware/admin-middleware");

router.get("/", authMiddleware, getCart);

router.post("/add", authMiddleware, addToCart);

router.delete("/delete/:id", authMiddleware, deleteFromCart);

router.put("/updateQuantity/:id", authMiddleware, updateProductQuantity);

router.delete("/clear", authMiddleware, clearCart);

router.get("/summary", authMiddleware, authAdminMiddleware, getSummary);

module.exports = router;
