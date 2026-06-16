const express = require("express");
const commentRouter = express.Router();

const {
  addComment,
  getPostComments,
  updateComment,
  deleteComment,
} = require("../controller/commentController");

const { protect } = require("../middleware/authMiddleware");
const { commentValidation } = require("../middleware/validationMiddleware");

//public route
commentRouter.get("/:postId", getPostComments);

// Protected routes (require authentication)
commentRouter.post("/:postId",          protect, commentValidation, addComment);
commentRouter.put("/:commentId",        protect, commentValidation, updateComment);
commentRouter.delete("/:commentId",     protect, deleteComment);


module.exports = commentRouter;