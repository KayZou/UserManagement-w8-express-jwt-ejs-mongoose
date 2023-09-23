const router = require("express").Router();
const adminController = require("../controllers/admin");
const logger = require("../middlewares/logger");
const upload = require("../middlewares/multerUpload");
router.get("/", (req, res) => {
  res.json({
    data: "salam admin route",
  });
});

router.post(
  "/create",
  logger.verifyToken,
  upload.single("profileImage"),
  adminController.createUser,
);
router.get("/get", logger.verifyToken, adminController.getUsers);

router.post("/user/login", adminController.userLogin);

router.post(
  "/edit/:uid",
  upload.single("profileImage"),
  logger.verifyToken,
  adminController.editUser,
);

router.post("/delete/:uid", logger.verifyToken, adminController.deleteUser);

router.get("/search", logger.verifyToken, adminController.searchUsers);

router.post("/search", logger.verifyToken, adminController.searchUsers);
module.exports = router;
