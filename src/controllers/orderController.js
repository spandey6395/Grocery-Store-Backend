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

        let tQ = 0
        for (let i = 0; i < cart.items.length; i++) {
            tQ += cart.items[i].quantity
        }

        const order = {
            userId: _id.toString(),
            items: cart.items,
            totalPrice: cart.totalPrice,
            totalItems: cart.totalItems,
            totalQuantity: tQ
        }
        console.log(order)
        console.log(order.totalQuantity)

        const createOrder = await orderModel.create(order)
        return res.status(201).send({ status: false, message: "Order created successfully", data: createOrder })
    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });

    }
}

const updateOrder = async function (req, res) {
    try {
        let data = req.body
        let _id = req.params.userId
        let { orderId, status } = data

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Order details required" })
        }
        if (!isValid(orderId)) {
            return res.status(400).send({ status: false, message: "order Id is required" })
        }
        if (!isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "Invalid order Id" })
        }

        const findOrder = await orderModel.findOne({ _id: orderId, isDeleted: false })

        if (!findOrder) {
            return res.status(400).send({ status: false, message: "Order not found" })
        }
        if (!(findOrder.userId == _id)) {
            return res.status(400).send({ status: false, message: "Order doesn't belongs to this user" })
        }
        if (!(findOrder.cancellable == true)) {
            return res.status(400).send({ status: false, message: "This Order can not be cancelled" })
        }

        if (status) {
            if (!["pending", "completed", "canceled"].includes(status.trim())) {
                return res.status(400).send({ status: false, message: `status must be one of these only ${["pending", " completed", " canceled"]}` })

            }
        }

        const updateOrder = await orderModel.findOneAndUpdate({ _id: orderId }, { status: status }, { new: true })
        return res.status(400).send({ status: false, message: `Order ${status} successfully`, data: updateOrder })
    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });

    }
}

module.exports = { createOrder, updateOrder }

