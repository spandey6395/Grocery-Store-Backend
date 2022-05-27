const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")
const { isValidObjectId } = require('../middleware/validator')

const addToCart = async function (req, res) {
    try {

        const _id = req.params.userId
        const data = req.body
        const { cartId, productId, quantity } = data

        if (!productId) {
            return res.status(400).send({ status: false, message: "Provide productId" })
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid productId" })
        }

        if (!quantity) {
            return res.status(400).send({ status: false, message: "Quantity is required" })
        }

        if (!/^[0-9]+$/.test(quantity)) {
            return res.status(400).send({ status: false, message: "Quantity should be a valid number" })
        }

        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) {
            return res.status(404).send({ status: false, message: "product does not exists" })
        }

        if (!cartId) {
            const findCart = await cartModel.findOne({ userId: _id })

            if (findCart) {
                return res.status(400).send({ status: false, message: `cart is already created - Use this cartId ${findCart._id}` })
            }

            if (!findCart) {
                const addToCart = {
                    userId: _id,
                    items: {
                        productId: productId,
                        quantity: quantity
                    },
                    totalPrice: findProduct.price * quantity,
                    totalItems: 1
                }

                const cart = await cartModel.create(addToCart)
                return res.status(201).send({ status: true, message: "cart created and product added to cart successfully", data: cart })
            }
        }


        if (cartId) {
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Invalid cartId" })
            }

            const findRealCart = await cartModel.findOne({ userId: _id })
            if (findRealCart) {
                if (findRealCart._id != cartId) {
                    return res.status(400).send({ status: false, message: `Incorrect CartId use this ${findRealCart._id}` })
                }
            }

            const findCart = await cartModel.findOne({ _id: cartId })
            if (!findCart) {
                const addToCart = {
                    userId: _id,
                    items: [{
                        productId: productId,
                        quantity: quantity
                    }],
                    totalPrice: findProduct.price * quantity,
                    totalItems: 1
                }

                const cart = await cartModel.create(addToCart)

                return res.status(201).send({ status: true, message: "cart created and product added to cart successfully", data: cart })
            }

            if (findCart) {

                //increase quantity
                for (let i = 0; i < findCart.items.length; i++) {

                    if (`${findCart.items[i].productId}` == `${findProduct._id}`) {
                        findCart.items[i].quantity = findCart.items[i].quantity + quantity
                        findCart.totalPrice = (findProduct.price * quantity) + findCart.totalPrice
                        findCart.totalItems = findCart.items.length
                        findCart.save()
                        return res.status(200).send({ status: true, message: "product added to cart", data: findCart })
                    }
                }

                //add new item in cart
                findCart.items[(findCart.items.length)] = { productId: productId, quantity: quantity }
                findCart.totalPrice = (findProduct.price * quantity) + findCart.totalPrice
                findCart.totalItems = findCart.items.length
                findCart.save()
                return res.status(200).send({ status: true, message: "product added to cart", data: findCart })
            }
        }

    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });

    }
}


const getCart = async function (req, res) {

    try {
        let userId = req.params.userId

        const findCart = await cartModel.findOne({ userId: userId })

        if (!findCart) {
            return res.status(400).send({ status: false, message: "User's cart doesn't exist" })
        }

        return res.status(200).send({ status: true, message: "Cart details", data: findCart })
    }
    catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });
    }

}

const updateCart = async function (req, res) {
    res.status(202).send({ status: true, message: "Work in progress please try after some time or contact pratik to complete this api soon" })
}

const deleteCart = async function (req, res) {

    try {
        const userId = req.params.userId

        const findCart = await cartModel.findOne({ userId: userId })

        if (!findCart) {
            return res.status(400).send({ status: false, message: "User's cart doesn't exist" })
        }

        const deletedCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true })

        return res.status(200).send({ status: false, message: "Cart items deleted successfully", data: deletedCart })

    }

    catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });
    }

}


module.exports = { addToCart, updateCart, getCart, deleteCart }