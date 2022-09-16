const orderModel = require('../models/orderModel')
const { isValidRequestBody, isValidObjectId, isValid } = require('../middleware/validator')


const createOrder = async function (req, res) {
    try {
        let data = req.body
      
        let { quantity,paymentInfo,totalPrice,productId,items} = data

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "Order details required" })
        }

        if (!isValid(quantity)) {
            return res.status(400).send({ status: false, message: "quantity is required" })
        }
        if (!isValid(paymentInfo)) {
            return res.status(400).send({ status: false, message: "paymentInfo is required" })
        }
        if (!isValid(totalPrice)) {
            return res.status(400).send({ status: false, message: "totalPrice is required" })
        }
        if (!isValid(items)) {
            return res.status(400).send({ status: false, message: "item is required" })
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid productId" })

        }

        

        if (paymentInfo) {
            if (!["pending", "completed", "canceled"].includes(paymentInfo.trim())) {
                return res.status(400).send({ status: false, message: `status must be one of these only ${["pending", " completed", " canceled"]}` })
            }
        }


       

        let order=new Object()
        order.quantity=quantity;
        order.paymentInfo=paymentInfo;
        order.totalPrice=totalPrice;
        order.productId=productId;
        order.items=items;



        const createOrder = await orderModel.create(order)
        return res.status(201).send({ status: false, message: "Order created successfully", data: createOrder })
    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });

    }
}


const getspecificUserbyorder = async function (req, res) {

    try {
      const params = req.params;
      const orderId = params.orderId;
  
      if (!orderId) {
        res
          .status(400)
          .send({ status: false, message: "please enter orderId in params" });
      }
  
      if (!isValidObjectId(orderId)) {
        return res
          .status(400)
          .send({ status: false, message: "orderId is incorrect" });
      }
  
      const order = await orderModel.findOne({ _id: orderId }.select({userId:1},{productList:1}));
      if (!order) {
        return res.status(404).send({
          status: false,
          message: `order did not found with this ${orderId} id`,
        });
      }
      res
        .status(200)
        .send({ status: true, message: "order profile details", data: order });
    } catch (error) {
      console.log({ status: false, message: error.message });
      res.status(500).send({ status: false, message: error.message });
    }
  };









module.exports = { createOrder, getspecificUserbyorder }

