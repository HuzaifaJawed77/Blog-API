const Post = require("../models/Post");
const {
  successResponse,
  errorResponse,
  getPagination,
} = require("../utils/apiUtils");

// Create a new post

const createPost = async (req, res, next) => {
  try {
    const { title, content, summary, category, status } = req.body;
    const post = await Post.create({
      title,
      content,
      summary,
      category,
      status: status || "draft",
      author: req.user._id,
    });
    await post.populate([
      { path: "author", select: "username email" },
      { path: "category", select: "name slug" },
    ]);

    return successResponse(res, 201, "Post created successfully", post);
  } catch (error) {
    next(error);
  }
};

// Get all posts with pagination, filtering, and search

const getAllPosts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const filter = {};

    filter.status = req.query.status || "published";

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "username email")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    successResponse(res, 200, "Posts retrieved successfully", {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single post
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("author", "username email bio")
      .populate("category", "name slug")
      .populate({
        path: "comments",
        populate: { path: "author", select: " name" },
      });

    if (!post) {
      return errorResponse(res, 404, "Post not found");
    }
    successResponse(res, 200, "Post retrieved successfully", post);
  } catch (error) {
    next(error);
  }
};

// get posts by author

const getPostsByAuthor = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [posts, total] = await Promise.all([
      Post.find({ author: req.params.authorId, status: "published" })
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({ author: req.params.authorId, status: "published" }),
    ]);

    successResponse(res, 200, "Author posts fetched", { total, page, posts });
  } catch (error) {
    next(error);
  }
};

//update a post
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Only the author or an admin can update the post
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this post" });
    }

    const { title, content, summary, category, status } = req.body;

    // Update fields (the pre-save hook will regenerate the slug if title changed)
    if (title)    post.title    = title;
    if (content)  post.content  = content;
    if (summary)  post.summary  = summary;
    if (category) post.category = category;
    if (status)   post.status   = status;

    await post.save();
    await post.populate([
      { path: "author", select: "name email" },
      { path: "category", select: "name slug" },
    ]);

    successResponse(res, 200, "Post updated", post);
  } catch (error) {
  console.log("UPDATE POST ERROR:");
  console.log(error);
  next(error);
}
};
//delete a post
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return errorResponse(res, 404, "Post not found");
    }
    // Only the author or an admin can delete the post
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return errorResponse(res, 403, "Not authorized to delete this post");
    }

    // Soft delete: mark the post as deleted without removing it from the database
    post.isDeleted = true;
    await post.save();

    successResponse(res, 200, "Post deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Like or unlike a post

const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return errorResponse(res, 404, "Post not found");
    }
    const userId = req.user._id.toString();
    const hasLiked = post.likes.map((id) => id.toString()).includes(userId);

    if (hasLiked) {
      // Unlike :remove user ID from likes array
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like : add user ID to likes array
      post.likes.push(userId);
    }

    const updatedPost = await post.save();
    successResponse(res, 200, hasLiked ? "Post unliked" : "Post liked", {
      liked: !hasLiked,
      likesCount: updatedPost.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  updatePost,
  deletePost,
  toggleLikePost,
};

