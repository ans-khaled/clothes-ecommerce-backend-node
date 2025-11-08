const Category = require("../models/category");

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find({});

    if (!categories || categories.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No categories found",
        data: categories,
      });
    }

    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error while fetching all categories", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category with id ${categoryId} Not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Category found successfully",
      data: category,
    });
  } catch (error) {
    console.error(
      "Error while fetching specific category by id",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const addCategory = async (req, res) => {
  try {
    let { name, description, subCategory } = req.body;
    name = name.toLowerCase();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required, please try again",
      });
    }

    const category = await Category.findOne({ name });

    if (category) {
      if (category.isDeleted) {
        category.isDeleted = false;
        category.description = description;
        category.subCategory = subCategory;
        await category.save();

        return res.status(200).json({
          success: true,
          message: `${name} category restored successfully`,
          data: category,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "This category already exist, please try again",
        });
      }
    }

    const newCategory = new Category({
      name,
      description,
      subCategory,
    });
    await newCategory.save();

    res.status(200).json({
      success: true,
      message: `${name} category added successfully`,
      data: newCategory,
    });
  } catch (error) {
    console.error("Error while adding new category", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const newUdateInfo = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      newUdateInfo,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: `Category with id ${categoryId} Not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error while updating category", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const softDeleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: `Category with id ${categoryId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.error("Error while deleteing category", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategory,
  getCategoryById,
  addCategory,
  updateCategory,
  softDeleteCategory,
};
