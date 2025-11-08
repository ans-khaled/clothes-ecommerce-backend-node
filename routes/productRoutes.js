const express = require("express");
const {
  getAllProduct,
  getProductById,
  addNewProduct,
  updateProduct,
  softDeleteProduct,
  searchProductByName,
  filterProducts,
  filterProductsByCategory,
} = require("../controller/product-controller");

const upload = require("../middleware/upload-middleware");

const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const authAdminMiddleware = require("../middleware/admin-middleware");

// Public routes
router.get("/", getAllProduct);
router.post("/filter", filterProducts);
router.get("/search/:productName/:categoryName", searchProductByName);
router.get("/:id", getProductById);
router.get("/filterByCategory/:categoryName", filterProductsByCategory);

// Admin routes
router.post(
  "/add",
  authMiddleware,
  authAdminMiddleware,
  upload.single("image"),
  addNewProduct
);
router.put(
  "/update/:id",
  authAdminMiddleware,
  upload.single("image"),
  updateProduct
);
router.delete("/delete/:id", authAdminMiddleware, softDeleteProduct);

module.exports = router;
