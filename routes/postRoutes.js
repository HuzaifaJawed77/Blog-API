const express = require("express");
const postRouter = express.Router();

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByAuthor,
  toggleLikePost,
} = require("../controller/postController");


const {protect} = require("../middleware/authMiddleware");
const{createPostValidation , updatePostValidation} = require("../middleware/validationMiddleware");

postRouter.get("/",getAllPosts);
postRouter.get("/:id",getPostById);
postRouter.get("/author/:authorId",getPostsByAuthor);

// Protected routes (require authentication)
postRouter.post("/", protect, createPostValidation, createPost);
postRouter.put("/:id", protect, updatePostValidation, updatePost);
postRouter.delete("/:id", protect, deletePost);
postRouter.post("/:id/like", protect, toggleLikePost);

module.exports = postRouter;













