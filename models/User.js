const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,  
        required: [true ,"Name is required"],
        trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
  email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries by default
    },

    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user',    
    },

    bio: {
        type: String,
        maxlength: [200, "Bio cannot exceed 200 characters"],
        default: "",
    },

  refreshToken: {
      type: String,
      select: false, // Never return refresh token in queries by default
    },
}, { timestamps: true });

// Hash password before saving

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

        const salt = await bycrypt.genSalt(10);
        this.password = await bycrypt.hash(this.password, salt);
        next();
  
  }); 

  userSchema.methods.comparePassword = async function(eneteredPassword) {
    return await bycrypt.compare(eneteredPassword, this.password);
  } ;

  const User = mongoose.model('User', userSchema);
  
  module.exports = User;