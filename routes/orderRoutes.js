const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/order-controller");
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const authAdminMiddleware = require("../middleware/admin-middleware");

router.post("/create", authMiddleware, createOrder);

router.get("/", getAllOrders);
router.get("/:id", authMiddleware, getOrderById);

router.put("/updateStatus/:id", updateOrderStatus);

router.delete("/delete/:id", deleteOrder);

module.exports = router;
