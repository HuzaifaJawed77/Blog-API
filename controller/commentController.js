const Comment = require("../models/Comment");
const Post = require("../models/Post");

const { successResponse, errorResponse } = require("../utils/apiUtils");

//Add a comment to a post

const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return errorResponse(res, 404, "Post not found");
    }

    const comment = await Comment.create({
      content: req.body.content,
      author:  req.user._id,
      post:    req.params.postId,
    });

    await comment.populate("author", "name email");

    successResponse(res, 201, "Comment added", comment);
  } catch (error) {
    next(error);
  }
};

//Get All comments for a post

const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    successResponse(res, 200, "Comments retrieved successfully", {
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

//Update my comment

const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return errorResponse(res, 404, "Comment not found");
    }
    if (comment.author.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, "Not authorized to update this comment");
    }
    comment.content = req.body.content || comment.content;
    await comment.save();
    successResponse(res, 200, "Comment updated successfully", comment);
  } catch (error) {
    next(error);
  }
};

//Delete my comment

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return errorResponse(res, 404, "Comment not found");
    }
    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return errorResponse(res, 403, "Not authorized to delete this comment");
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    successResponse(res, 200, "Comment deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getPostComments,
  updateComment,
  deleteComment,
};
