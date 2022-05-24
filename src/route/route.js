const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  login,
  updateUser,
} = require("../controllers/userController");
const { authentication, authorization } = require("../middleware/auth");

router.post("/register", createUser);
router.post("/login", login);
router.get("/user/:userId/profile", authentication, getUser);
router.put("/user/:userId/profile", authentication, authorization, updateUser);

module.exports = router;
