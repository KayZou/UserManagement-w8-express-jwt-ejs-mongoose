require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email");
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await sendEmail({
      email: newUser.email,
      subject: "You've just created an account!",
      text: "Welcome to our platform!",
    });

    // res.status(201).json({
    //   status: "success",
    //   data: newUser,
    // });
    res.redirect("/users/login");
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "fail",
      data: "An error occurred during registration.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        data: "email not found",
      });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({
        status: "fail",
        data: "Authentication failed",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true, // Make the cookie accessible only via HTTP
      secure: true, // Require HTTPS to send the cookie
      sameSite: "strict", // Apply strict same-site policy
      maxAge: 86400 * 1000, // Expires in 24 hours
    });
    // res.status(200).json({ token });
    res.render("dashboard", { user });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      status: "fail",
      data: err.message,
    });
  }
};

module.exports = {
  signup,
  login,
};
