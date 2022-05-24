const express = require("express");
const router = express.Router();
const { createUser, getUser, login } = require("../controllers/userController");

router.post("/register", createUser);
router.post("/login", login);
router.get("/user/:userId/profile", getUser);

module.exports = router;
