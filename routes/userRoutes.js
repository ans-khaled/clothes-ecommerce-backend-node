const express = require("express");
const {
  register,
  login,
  getAllUsers,
} = require("../controller/auth-controller.js");

const authMiddleware = require("../middleware/auth-middleware");
const authAdminMiddleware = require("../middleware/admin-middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/getAllUsers", authMiddleware, authAdminMiddleware, getAllUsers);

module.exports = router;
