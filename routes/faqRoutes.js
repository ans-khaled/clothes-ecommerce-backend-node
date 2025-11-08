const express = require("express");
const router = express.Router();
const {
  addQuestion,
  getAllQuestions,
  updateQuestion,
  softDeleteQuestion,
} = require("../controller/faq-controller");

const authAdminMiddleware = require("../middleware/admin-middleware");
const authMiddleware = require("../middleware/auth-middleware");

// public
router.get("/", getAllQuestions);

// admin only
router.post("/add", authMiddleware, authAdminMiddleware, addQuestion);

// admin only
router.put("/update/:id", authMiddleware, authAdminMiddleware, updateQuestion);

// admin only
router.delete(
  "/delete/:id",
  authMiddleware,
  authAdminMiddleware,
  softDeleteQuestion
);

module.exports = router;
