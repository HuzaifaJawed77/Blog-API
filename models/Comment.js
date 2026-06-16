const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
        minLength: [5, "Content must be at least 5 characters"],
        maxLength: [200, "Content cannot exceed 200 characters"]
    },

    author :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"],
    },

    post:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Post is required"],
    },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
module.exports  = Comment;