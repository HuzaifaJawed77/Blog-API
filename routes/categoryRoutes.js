const express = require("express");
const categoryRouter = express.Router();

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");

const { protect, authorize } = require("../middleware/authMiddleware");

//public routes
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);

//admin routes
categoryRouter.post("/",protect , authorize("admin"), createCategory);
categoryRouter.put("/:id", protect , authorize("admin"), updateCategory);
categoryRouter.delete("/:id", protect , authorize("admin"), deleteCategory);

module.exports = categoryRouter;