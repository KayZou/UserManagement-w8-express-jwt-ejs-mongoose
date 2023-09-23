const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  username: { type: String, trim: true, minlength: 2 },
  phone: { type: Number, trim: true, maxlength: 10 },
  age: { type: Number, min: [18, "khdam f noire?"] },
  email: { type: String, unique: true, trim: true },
  salary: { type: Number, min: [2000, "gha smig b3da asahbi"] },
  profileImage: {
    type: String,
    default: "",
  },
  password: { type: String, minlength: [8, "rah mdp hada!"] },
  createdByAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("userProfile", userProfileSchema);
