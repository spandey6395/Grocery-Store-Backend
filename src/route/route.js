const express = require("express");
const router = express.Router();
const { createUser, getUser, login, updateUser, } = require("../controllers/userController");
const { productById, deleteProduct, createProduct, filterProduct, updateProduct } = require("../controllers/productController");
const { addToCart, updateCart, getCart, deleteCart } = require("../controllers/cartController")
const { authentication, authorization } = require("../middleware/auth");
const { route } = require("express/lib/application");
const { createOrder, updateOrder } = require("../controllers/orderController");

//feature 1 user api's
router.post("/register", createUser);
router.post("/login", login);
router.get("/user/:userId/profile", authentication, authorization, getUser);
router.put("/user/:userId/profile", authentication, authorization, updateUser);

//feature 2 product api's
router.post("/products", createProduct)
router.get("/products", filterProduct)
router.get("/products/:productId", productById)
router.put("/products/:productId", updateProduct)
router.delete("/products/:productId", deleteProduct)

//feature 3 cart api's
router.post("/users/:userId/cart", authentication, authorization, addToCart)
router.put("/users/:userId/cart", authentication, authorization, updateCart)
router.get("/users/:userId/cart", authentication, authorization, getCart)
router.delete("/users/:userId/cart", authentication, authorization, deleteCart)

//feature 4 cart api's
router.post("/users/:userId/orders", createOrder)
router.put("/users/:userId/orders", updateOrder)

module.exports = router;
