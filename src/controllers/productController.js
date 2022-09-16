const productModel = require("../models/productModel")
const { isValid, decimalNumRegex, isValidRequestBody, isValidObjectId, isValidSize } = require("../middleware/validator")

const createProduct = async function (req, res) {
    try {
        const data = req.body
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "enter product details" })
        }
      
        let { price, availableSizes,productInfo ,quantityAvailable} = data

      
        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: "price is required" })
        }
       

        if (!isValid(availableSizes)) {
            return res.status(400).send({ status: false, message: "availableSizes is required" })
        }
         
        if (!isValid(productInfo)) {
            return res.status(400).send({ status: false, message: "productInfo is required" })
        }

            
        if (!isValid(quantityAvailable)) {
            return res.status(400).send({ status: false, message: "quantityAvailable is required" })
        }
        //format validation
        if (!decimalNumRegex.test(price)) {
            return res.status(400).send({ status: false, message: "Invalid price" })
        }
        

        if (availableSizes) {
            if (Array.isArray(isValidSize(availableSizes))) {
                data.availableSizes = isValidSize(availableSizes)
            } else {
                return res.status(400).send({ status: false, message: `size should be one these only ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
            }
        }

      

        const product = await productModel.create(data)
        res.status(201).send({ status: true, message: "Product created successfully", data: product })

    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });
    }
}


const updateProduct = async (req, res) => {
    try {
        let body = req.body
        const productId = req.params.productId

        if (!isValidRequestBody(body)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide  details to update' })
            return
        }

        if (!isValidObjectId(productId)) {
            return res.status(404).send({ status: false, message: "productId is  Invalid" })
        }

        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false, })

        if (!findProduct) {
            res.status(404).send({ status: false, message: "product Not Found" })
            return
        }

     
        let {  price, availableSizes,quantityAvailable, productInfo} = body
       

        if (price) {
            if (!decimalNumRegex.test(price)) {
                return res.status(400).send({ status: false, message: "Please provide A Valid Price" })
            }
        }

       

        if (availableSizes != undefined) {
            if (Array.isArray(isValidSize(availableSizes))) {
                body.availableSizes = isValidSize(availableSizes)
            } else {
                return res.status(400).send({ status: false, message: `size should be one these only ${["S", "XS", "M", "X", "L", "XXL", "XL"]}` })
            }
        }
        if (quantityAvailable) {
            if (!decimalNumRegex.test(quantityAvailable)) {
                return res.status(400).send({ status: false, message: "Please provide A Valid Quantity" })
            }
        }
           
        if (!isValid(productInfo)) {
            return res.status(400).send({ status: false, message: "productInfo is required" })
        }

     
        else {
            let updateProduct = await productModel.findOneAndUpdate({ _id: productId }, body, { new: true });
            res.status(200).send({ status: true, message: "Successfully Updated", data: updateProduct });
        }

    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });
    }
}

module.exports = {   createProduct, updateProduct }

