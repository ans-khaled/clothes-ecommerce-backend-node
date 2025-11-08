const Product = require("../models/product");
const Category = require("../models/category");
const product = require("../models/product");

const getAllProduct = async (req, res) => {
  try {
    const allProducts = await Product.find({});

    if (!allProducts || allProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found",
        data: allProducts,
      });
    }

    res.status(200).json({
      success: true,
      message: "All Products fetched successfully",
      data: allProducts,
    });
  } catch (error) {
    console.error("Error while getting all products", error.message);
    res.status(400).json({
      success: false,
      message: "Error in server",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const getProduct = await Product.findById(productId);
    if (!getProduct || getProduct.isDeleted) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${productId} Not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: `Product with id ${productId} fetched successfully`,
      data: getProduct,
    });
  } catch (error) {
    console.log("Error while getting product: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const addNewProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, subCategory } = req.body;

    if (!name || !price || !stock || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    let image = null;
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      category,
      subCategory,
      image,
    });

    await newProduct.save();

    if (newProduct) {
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: newProduct,
      });
    }
  } catch (error) {
    console.error("Error while adding product:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, stock, category, subCategory } = req.body;

    const updateData = {
      name,
      description,
      price,
      stock,
      category,
      subCategory,
    };

    // Handle image
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct || updatedProduct.isDeleted) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${productId} Not found`,
      });
    }
    res.status(200).json({
      success: true,
      message: `Product updated successfully`,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error while updating product:", error.message);
    res.status(500).json({
      success: false,
      message: "Something going wrong",
      error: error.message,
    });
  }
};

// soft delete (not deleteing from database).
const softDeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${productId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Product with id ${productId} deleted successfully (soft delete)`,
      data: deletedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// To use in search function
const getCategoryIdByName = async (categoryName) => {
  if (!categoryName) return null;
  const category = await Category.findOne({
    name: categoryName.toLowerCase().trim(),
  });
  return category ? category._id : null;
};

// Search on product by name
const searchProductByName = async (req, res) => {
  try {
    const { productName, categoryName } = req.params;
    console.log(productName, categoryName);

    if (!productName || productName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!["men", "women"].includes(categoryName.toLowerCase().trim())) {
      return res.status(400).json({
        success: false,
        message: `categoryName should be ["men" or "women"]`,
      });
    }

    const categoryId = await getCategoryIdByName(categoryName);
    if (!categoryId) {
      return res
        .status(404)
        .json({ message: `Category "${categoryName}" not found` });
    }

    const products = await Product.find({
      category: categoryId,
      name: { $regex: productName, $options: "i" },
      isDeleted: false,
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Products with name ${productName} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Products is fetched successfully`,
      data: products,
    });
  } catch (error) {
    console.error("Error while fetching product", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Filter products bu price and category and subcategory
const filterProducts = async (req, res) => {
  try {
    const { category, subCategory, maxPrice, minPrice } = req.body;

    let filter = { isDeleted: false };
    console.log(filter);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category is required`,
      });
    }

    const foundCategory = await Category.findOne({
      name: category.toLowerCase(),
    });

    console.log(foundCategory);

    if (!foundCategory) {
      return res.status(404).json({
        success: false,
        message: `Category "${category}" not found`,
      });
    }

    filter.category = foundCategory._id;

    if (subCategory) filter.subCategory = subCategory;

    if (minPrice && maxPrice && minPrice > maxPrice) {
      return res.status(400).json({
        success: false,
        message: "minPrice cannot be greater than maxPrice",
      });
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    console.log(filter);

    const products = await Product.find(filter);

    console.log(products);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found with given filters",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Filteration done successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error while filteration", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const filterProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    if (!categoryName) {
      return res.status(400).json({ message: "Category is required" });
    }
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const products = await Product.find({ category: category._id });
    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json({
      success: true,
      message: "Products filtered successfully",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllProduct,
  getProductById,
  addNewProduct,
  updateProduct,
  softDeleteProduct,
  searchProductByName,
  filterProducts,
  filterProductsByCategory,
};
