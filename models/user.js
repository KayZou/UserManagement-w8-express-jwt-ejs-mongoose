const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: [true, "Username is required."],
    unique: [true, "Username is already taken."],
    trim: true,
  },
  email: {
    type: String,
    // required: [true, "Email is required."],
    unique: [true, "Email is already taken."],
    lowercase: true,
  },
  password: {
    type: String,
    // required: [true, "Password is required."],
    minlength: [6, "Password must be at least 6 characters long."],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
