const cartModel = require("../models/cartModel")
const productModel = require("../models/productModel")
const { isValidObjectId, isValid } = require('../middleware/validator')

const addToCart = async function (req, res) {
    try {

        const _id = req.params.userId
        const data = req.body
        let { cartId, productId, quantity } = data

        if (!productId) {
            return res.status(400).send({ status: false, message: "Provide productId" })
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid productId" })
        }

        if (!quantity) {
            quantity = 1
            // return res.status(400).send({ status: false, message: "Quantity is required" })
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
                        quantity: quantity || 1
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
    try {
        const userId = req.params.userId
        const info = req.body

        //Extract body
        const { cartId, productId, removeProduct } = info

        if (!isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "enter the valid cartId in body" })
        }
        const findCart = await cartModel.findOne({ _id: cartId })
        if (!findCart) {
            return res.send(400).send({ status: false, message: "No such cartId exist" })
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "enter the valid productId in body" })
        }
        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) {
            return res.send(400).send({ status: false, message: `No such Product exist with this ${productId} Product id ` })
        }

        if (!isValid(removeProduct)) return res.status(400).send({ status: false, message: "removeProduct is required" })

        if (!/^[0|1]$/.test(removeProduct)) {
            return res.status(400).send({ status: false, message: "removeProduct should either be 0 (to remove  product from cart) or 1 (to reduce quantity by one)" })
        }

        for (let i = 0; i < findCart.items.length; i++) {

            if (`${findCart.items[i].productId}` == `${findProduct._id}`) {

                //reduce quantity by one
                if (removeProduct == 1 && findCart.items[i].quantity > 1) {
                    findCart.items[i].quantity = (findCart.items[i].quantity - 1)
                    findCart.save()
                    const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $inc: { totalPrice: -(findProduct.price) }, totalItems: findCart.items.length }, { new: true }).lean()

                    updatedCart.items = findCart.items

                    return res.status(200).send({ status: true, message: "product added to cart", data: updatedCart })
                }
                else {
                    //remove product
                    const updatedCart = await cartModel.findOneAndUpdate({ _id: cartId }, { $pull: { items: { productId: productId } }, $inc: { totalItems: -1, totalPrice: -(findProduct.price * findCart.items[i].quantity) } }, { new: true })
                    return res.status(200).send({ status: true, message: `${productId} is removed`, data: updatedCart })
                }
            }
        }

        return res.status(400).send({ status: false, message: "product does not exists in cart" })

    }
    catch (error) {
        res.status(500).send({ status: false, msg: "server error", message: error.message })
    }
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