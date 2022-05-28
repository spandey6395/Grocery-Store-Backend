const orderModel = require('../models/orderModel')

const createOrder = async function (req, res) {
    try {

    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });

    }
}

const updateOrder = async function (req, res) {
    try {

    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });

    }
}

module.exports = { createOrder, updateOrder }