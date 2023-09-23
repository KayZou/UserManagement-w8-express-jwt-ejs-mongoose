const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("register");
});
module.exports = router;
