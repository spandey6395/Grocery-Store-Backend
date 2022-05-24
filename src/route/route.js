const express = require("express");
const router = express.Router();
const { createUser, getUser } = require("../controllers/userController");

router.post("/register", createUser);
router.get("/user/:userId/profile", getUser)

module.exports = router;
