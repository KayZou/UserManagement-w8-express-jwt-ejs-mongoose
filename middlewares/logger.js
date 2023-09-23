require("dotenv").config();
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(404).json({
      status: "fail",
      data: "Authentication failed",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(404).json({
        status: "fail",
        data: err.message,
      });
    }
    req.user = decoded;
    next();
  });
};
module.exports = { verifyToken };
