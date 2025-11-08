const express = require("express");
const {
  getAllCategory,
  getCategoryById,
  addCategory,
  updateCategory,
  softDeleteCategory,
} = require("../controller/category-controller");

const authMiddleware = require("../middleware/auth-middleware");
const authAdminMiddleware = require("../middleware/admin-middleware");

const router = express.Router();

router.get("/", getAllCategory);
router.get("/:id", getCategoryById);

router.post("/add", addCategory);

router.put("/update/:id", updateCategory);

router.delete("/delete/:id", softDeleteCategory);

module.exports = router;
