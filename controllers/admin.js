const userProfile = require("../models/userProfile");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email");
const generateRandomPassword = () => {
  const length = 10; // Set the desired length of the password
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};
const randomPassword = generateRandomPassword();

const createUser = async (req, res) => {
  const { username, phone, age, email, salary } = req.body;
  const profileImage = req.file ? req.file.filename : undefined;
  const hashedPassword = await bcrypt.hash(randomPassword, 12);
  try {
    const newUserProfile = await userProfile.create({
      username,
      phone,
      age,
      email,
      salary,
      profileImage,
      password: hashedPassword,
      createdByAdmin: req.userId,
    });
    try {
      await sendEmail({
        email: newUserProfile.email,
        subject: "you are now one of the personnel",
        text: `Hello,\n\nWelcome to Your App! You can now log in using your email and the following temporary password:\n\nEmail: ${newUserProfile.email}\nPassword: ${randomPassword}\n\nPlease make sure to change your password after logging in for the first time for security reasons.\n\nThank you for joining!\n\nBest regards,\n[User Management Team]`,
      });
    } catch (err) {
      console.log(err.message);
    }

    // res.status(201).json({
    //   status: "success",
    //   data: newUserProfile,
    // });
    res.render("showUser", { user: newUserProfile });
  } catch (err) {
    console.log(err.message);
  }
};
const getUsers = async (req, res) => {
  try {
    const { sortBy } = req.query;
    let sortCriteria = {};
    if (sortBy === "salary") {
      sortCriteria = { salary: 1 }; // Sort by salary in ascending order
    } else if (sortBy === "age") {
      sortCriteria = { age: 1 }; // Sort by age in ascending order
    }
    const users = await userProfile
      .find({ createdByAdmin: req.userId })
      .sort(sortCriteria);
    // res.status(200).json({
    //   status: "success",
    //   data: users,
    // });
    res.render("showUsers", { users });
  } catch (err) {
    console.log(err.message);
  }
};
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userProfile.findOne({ email });
    if (!user) {
      res.status(404).json({
        status: "fail",
        data: "user not found",
      });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      res.status(404).json({
        status: "fail",
        data: "password incorrect!",
      });
    }
    res.status(200).json({
      status: "success",
      data: "logged in!",
    });
  } catch (err) {
    console.log(err.message);
  }
};

const editUser = async (req, res) => {
  const { username, phone, age, email, salary } = req.body;
  const uid = req.params.uid;
  const profileImage = req.file ? req.file.filename : undefined;
  try {
    const user = await userProfile.findByIdAndUpdate(
      uid,
      {
        username,
        phone,
        email,
        age,
        salary,
        profileImage,
      },
      { new: true },
    );
    if (!user) {
      res.status(404).json({
        status: "fail",
        data: "user not found",
      });
    }
    // res.status(200).json({
    //   status: "success",
    //   data: user,
    // });
    res.redirect("/admins/get");
  } catch (err) {
    console.log(err.message);
  }
};
const deleteUser = async (req, res) => {
  const uid = req.params.uid;
  try {
    const user = await userProfile.findByIdAndDelete(uid);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        data: "user not found!",
      });
    }
    // res.status(204).json({
    //   status: "success",
    //   data: "user deleted!",
    // });
    res.redirect("/admins/get");
  } catch (err) {
    console.log(err.message);
  }
};

const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;

    const regex = new RegExp(username, "i");

    const users = await userProfile.find({ username: regex });

    if (users.length === 0) {
      // No matching users found
      return res.render("searchResults", {
        users: [],
        message: "No matching users found.",
      });
    }

    // Render a view with the search results
    res.render("searchResults", {
      users,
      message: `Search results for username: ${username}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createUser,
  getUsers,
  userLogin,
  editUser,
  deleteUser,
  searchUsers,
};
