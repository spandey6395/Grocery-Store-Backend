const orderModel = require('../models/orderModel')
const userModel = require("../models/userModel")
const { isValidRequestBody, isValidObjectId, isValid } = require('../middleware/validator')
const cartModel = require('../models/cartModel')

const createOrder = async function (req, res) {
    try {
        let data = req.body
        let _id = req.params.userId
        let { cartId, cancellable, status } = data

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Order details required" })
        }
        // if (!isValid(items)) {
        //     return res.status(400).send({ status: false, message: "Items is required" })
        // }
        // if (items.lenght == 0) {
        //     return res.status(400).send({ status: false, message: "Items filed must contain some values" })
        // }
        // if (!isValid(totalPrice)) {
        //     return res.status(400).send({ status: false, message: "totalPrice is required" })
        // }
        // if (!isValid(totalitems)) {
        //     return res.status(400).send({ status: false, message: "totalitems is required" })
        // }
        // if (!isValid(totalQuantity)) {
        //     return res.status(400).send({ status: false, message: "totalQuantity is required" })
        // }

        if (!isValid(cartId)) {
            return res.status(400).send({ status: false, message: "cartId is required" })
        }
        const cart = await cartModel.findById({ _id: cartId })
        if (!cart) {
            return res.status(400).send({ status: false, message: "cartId does not exist" })
        }

        if (cancellable) {
            if (!(cancellable == true || cancellable == false)) {
                return res.status(400).send({ status: false, message: "cancellable must be either true or false" })
            }
        }

        if (status) {
            if (!["pending", "completed", "canceled"].includes(status.trim())) {
                return res.status(400).send({ status: false, message: `status must be one of these only ${["pending", " completed", " canceled"]}` })

            }
        }

        const createOrder = await orderModel.create(data)
        return res.status(400).send({ status: false, message: "Order created successfully", data: createOrder })
    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });

    }
}

const updateOrder = async function (req, res) {
    try {
        let data = req.body
        let _id = req.params.userId
        let { orderId } = data

        if (!_id == userId) {
            return res.status(400).send({ status: false, message: "Unauthorized user" })
        }

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Order details required" })
        }
        if (!isValid(orderId)) {
            return res.status(400).send({ status: false, message: "User Id is required" })
        }
        if (!isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "Invalid user Id" })
        }
        if (_id) {
            const findUser = await userModel.findOne({ _id: _id })
            if (!findUser) {
                return res.status(400).send({ status: false, message: "User not found" })
            }
        }
        const findOrder = await orderModel.findOne({ _id: orderId, isDeleted: false })

        if (!findOrder) {
            return res.status(400).send({ status: false, message: "Order not found" })
        }
        if (!(findOrder.userId == userId)) {
            return res.status(400).send({ status: false, message: "Order doesn't belongs to this user" })
        }
        if (!(findOrder.cancellable == true)) {
            return res.status(400).send({ status: false, message: "This Order can not be cancelled" })
        }

        const updateOrder = await orderModel.findOneAndUpdate({ _id: orderId }, { status: "cancelled" }, { new: true })
        return res.status(400).send({ status: false, message: "Order cancelled successfully", data: updateOrder })
    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });

    }
}

module.exports = { createOrder, updateOrder }

