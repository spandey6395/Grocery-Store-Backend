const express = require("express");
const router = express.Router();
const usercontroller = require('../controller/userController')



router.get("/user/:userId/profile" ,usercontroller.getUser)










module.exports = router;
