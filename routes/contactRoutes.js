const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
} = require("../controller/contact-controller");

const authMiddleware = require("../middleware/auth-middleware");
const authAdminMiddleware = require("../middleware/admin-middleware");

// Public → user can send message
router.post("/create", createContact);

// Admin only → get all messages
router.get("/", authMiddleware, authAdminMiddleware, getAllContacts);

module.exports = router;
