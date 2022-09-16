const express = require("express");
const router = express.Router();
const { createUser, getUser, login,getuserwithmaxorder } = require("../controllers/userController");
const {  createProduct, updateProduct } = require("../controllers/productController");

const { authentication, authorization } = require("../middleware/auth");
const { createOrder,getspecificUserbyorder,} = require("../controllers/orderController");

//feature 1 user api's
router.post("/register", createUser);
router.post("/login", login);
router.get("/user/:userId", authentication,getUser);
router.get("/userspecific", authentication,getuserwithmaxorder);


//feature 2 product api's
router.post("/products", createProduct)

router.put("/products/:productId",authorization, updateProduct)




//feature 3 order api's

router.post("/ordercreate", createOrder)
router.get("/getordermax",authentication,getspecificUserbyorder)

//----------------if api is invalid OR wrong URL-------------------------
router.all("/**", function (req, res) {
    res
        .status(404)
        .send({ status: false, msg: "Requested API is not available" });
});


module.exports = router;