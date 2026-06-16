const {body , validationResult} = require("express-validator");
const { successResponse , errorResponse } = require("../utils/apiUtils");

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return errorResponse(res, 400, "Validation error", { errors: errors.array() });
    }
    next();
}

// Validation rules for registration
const registerValidation = [
body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 2 }).withMessage("Username must be at least 2 characters"),
 
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email"),
 
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
 
  validate,
];


// Validation rules for login
const loginValidation = [
 body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];


const createPostValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 }),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 20 }),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId(),

  validate,
];


const updatePostValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters"),

  body("content")
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage("Content must be at least 20 characters"),

  body("summary")
    .optional()
    .trim()
    .isLength({ max: 200 }),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID"),

  body("status")
    .optional()
    .isIn(["draft", "published"]),

  validate,
];


const commentValidation = [
  body("content")
    .trim()
    .notEmpty().withMessage("Comment cannot be empty")
    .isLength({ max: 500 }).withMessage("Comment cannot exceed 500 characters"),
  validate,
];






module.exports = { registerValidation , loginValidation , createPostValidation , updatePostValidation , commentValidation };