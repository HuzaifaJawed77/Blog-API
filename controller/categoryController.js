const Category = require("../models/Category");

const { successResponse, errorResponse } = require("../utils/apiUtils");

//Create a new category (Admin only)

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description,
      createdBy: req.user._id,
    });
    successResponse(res, 201, "Category created successfully", category);
  } catch (error) {
    next(error);
  }
};

//Get all categories (Public)

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });
    successResponse(res, 200, "Categories retrieved successfully", {
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

//Get single category by id

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "createdBy",
      "username email",
    );
    if (!category) {
      return next(new Error("Category not found"));
    }
    successResponse(res, 200, "Category retrieved successfully", category);
  } catch (error) {
    next(error);
  }
};

//Update category (Admin only)

const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if(!category){
errorResponse(res,404,"Category not found");
    }
    if(name) category.name = name;
    if(description) category.description = description;

    await category.save();
    successResponse(res, 200, "Category updated successfully", category);
  } catch (error) {
    next(error);
  }
};

//Delete category (Admin only)

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return errorResponse(res, 404, "Category not found");
    }
    successResponse(res, 200, "Category deleted successfully", category);
  } catch (error) {
    next(error);
  }
};


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
