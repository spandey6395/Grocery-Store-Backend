const express = require("express");
const router = express.Router();
const { createUser, getUser, login, updateUser, } = require("../controllers/userController");
const { productById, deleteProduct, createProduct ,filterProduct, updateProduct} = require("../controllers/productController");
const { authentication, authorization } = require("../middleware/auth");

//feature 1 api's
router.post("/register", createUser);
router.post("/login", login);
router.get("/user/:userId/profile", authentication, authorization, getUser);
router.put("/user/:userId/profile", authentication, authorization, updateUser);

//feature 2 api's
router.post("/products", createProduct)
router.get("/products", filterProduct)
router.get("/products/:productId", productById)
router.put("/products/:productId", updateProduct)
router.delete("/products/:productId", deleteProduct)


module.exports = router;
