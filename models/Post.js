const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    // Slug: URL-friendly title e.g. "My First Post" → "my-first-post"
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [20, "Content must be at least 20 characters"],
    },
    summary: {
      type: String,
      maxlength: [300, "Summary cannot exceed 300 characters"],
      default: "",
    },
    // "ref" links this to the User model — this is how MongoDB relationships work
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    // Likes is an array of user IDs who liked this post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    // Soft delete — instead of removing from DB, we mark it as deleted
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // Virtual fields are computed properties — they don't get saved in DB
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: like count ──────────────────────────────────────────────────────
postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// ─── Virtual: comments (populated from Comment model) ────────────────────────
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

// ─── Auto-generate slug before saving ────────────────────────────────────────
postSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Make slug unique by appending a random string if needed
    const existing = await mongoose.models.Post.findOne({ slug });
    if (existing && existing._id.toString() !== this._id.toString()) {
      slug = `${slug}-${Date.now()}`;
    }
    this.slug = slug;
  }
  next();
});

// ─── Query filter: always exclude soft-deleted posts ─────────────────────────
postSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
