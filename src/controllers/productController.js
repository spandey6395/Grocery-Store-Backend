const productModel = require("../models/productModel")
const { uploadFile } = require('../aws/aws')
const { isValid, decimalNumRegex, isValidRequestBody, isValidObjectId, isValidSize } = require("../middleware/validator")

const createProduct = async function (req, res) {
    try {
        const data = req.body
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: "enter product details" })
        }
        let { title, description, price, currencyId, currencyFormat, availableSizes, installments } = data

        //mandatory fields
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "title is required" })
        }
        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "description is required" })
        }
        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: "price is required" })
        }
        if (currencyId) {
            if (currencyId != "INR") {
                return res.status(400).send({ status: false, message: `${currencyId} Invalid - it should be INR` })
            }
        }
        if (currencyFormat) {
            if (currencyFormat != "₹") {
                return res.status(400).send({ status: false, message: `${currencyFormat} Invalid - it should be ₹` })
            }
        }

        if (!isValid(availableSizes)) {
            return res.status(400).send({ status: false, message: "availableSizes is required" })
        }

        //format validation
        if (!decimalNumRegex.test(price)) {
            return res.status(400).send({ status: false, message: "Invalid price" })
        }
        if (installments) {
            if (!/^[0-9]+$/.test(installments)) {
                return res.status(400).send({ status: false, message: "Invalid installments" })
            }
        }

        if (availableSizes) {
            if (Array.isArray(isValidSize(availableSizes))) {
                data.availableSizes = isValidSize(availableSizes)
            } else {
                return res.status(400).send({ status: false, message: `size should be one these only ["S", "XS", "M", "X", "L", "XXL", "XL"]` })
            }
        }

        // unique validation
        const uniqueTitle = await productModel.findOne({ title })
        if (uniqueTitle) {
            return res.status(400).send({ status: false, message: `${title} already exist use different title` })
        }

        //upload product image
        const files = req.files
        if (files && files.length > 0) {
            const uploadProductImage = await uploadFile(files[0])
            data.productImage = uploadProductImage
        } else {
            return res
                .status(400)
                .send({ status: false, message: "please upload product image" });
        }

        const product = await productModel.create(data)
        res.status(201).send({ status: true, message: "Product created successfully", data: product })

    } catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });
    }
}

const filterProduct = async function (req, res) {
    try {
        const data = req.query
        if (!isValidRequestBody(data)) {
            const allProducts = await productModel.find({ isDeleted: false })
            if (!allProducts) {
                return res.status(404).send({ status: false, message: "No products found" })
            }
            return res.status(200).send({ status: true, message: "products fetched successfully", data: allProducts })
        } else {
            // let data =req.query
            let availableSizes = req.query.size
            let title = req.query.name
            let priceGreaterThan = req.query.priceGreaterThan
            let priceLessThan = req.query.priceLessThan

            let filter = { isDeleted: false }

            if (title) {
                filter["title"] = title
            }

            if (priceGreaterThan) {
                filter["price"] = { $gt: `${priceGreaterThan}` }
            }
            if (priceLessThan) {
                filter["price"] = { $lt: `${priceLessThan}` }
            }

            if (availableSizes) {
                if (Array.isArray(isValidSize(availableSizes))) {
                    filter["availableSizes"] = { $in: isValidSize(availableSizes) }
                } else {
                    return res.status(400).send({ status: false, message: `size should be one these only ["S", "XS", "M", "X", "L", "XXL", "XL"]` })
                }
            }

            //sorting
            if (req.query.priceSort) {
                if ((req.query.priceSort != 1 && req.query.priceSort != -1)) {
                    return res.status(400).send({ status: false, message: 'use 1 for low to high and use -1 for high to low' })
                }
            }

            if (!priceGreaterThan && !priceLessThan) {
                const productList = await productModel.find(filter).sort({ price: req.query.priceSort })
                if (productList.length == 0) {
                    return res.status(400).send({ status: false, message: "No available products" })
                }
                return res.status(200).send({ status: true, message: "Products list", data: productList })
            }

            if (priceGreaterThan && priceLessThan) {
                const productList = await productModel.find({
                    $and: [filter, { price: { $gt: priceGreaterThan } }, {
                        price: { $lt: priceLessThan }
                    }]
                }).sort({ price: req.query.priceSort })
                if (productList.length == 0) {
                    return res.status(400).send({ status: false, message: "No available products" })
                }
                return res.status(200).send({ status: true, message: "Products list", data: productList })
            }

            if (priceGreaterThan || priceLessThan) {
                const productList = await productModel.find({ $and: [filter] }).sort({ price: req.query.priceSort })
                if (productList.length == 0) {
                    return res.status(400).send({ status: false, message: "No available products" })
                }
                return res.status(200).send({ status: true, message: "Products list", data: productList })
            }



        }
    }
    catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });
    }
}

const productById = async function (req, res) {
    try {
        const productId = req.params.productId

        if (!productId) {
            return res.status(400).send({ status: false, message: "Please provide product Id" })
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid product Id" })
        }

        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!findProduct) {
            return res.status(404).send({ status: false, message: "Product not found or it maybe deleted" })
        }
        return res.status(200).send({ status: true, message: "Product details", data: findProduct })

    }
    catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });
    }
}

const updateProduct = async (req, res) => {
    try {
        let Body = req.body
        const productId = req.params.productId


        if (!isValidRequestBody(Body)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide  details to update' })
            return
        }

        if (!isValidObjectId(productId)) {
            return res.status(404).send({ status: false, message: "productId is  Invalid" })
        }

        const Findproduct = await productModel.findOne({ _id: productId, isDeleted: false, })


        if (!Findproduct) {
            res.status(404).send({ status: false, message: "product Not Found" })
            return
        }
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = Body

        if (title || description || price || currencyId || currencyFormat || isFreeShipping || productImage || style || availableSizes || installments) {


            const Title = await productModel.findOne({ title: title });
            if (Title) {
                res.status(400).send({ status: false, message: `${title} Is Already In Used`, });
                return;
            }

            if (price <= 0) {
                return res.status(400).send({ status: false, message: "Please provide A Valid Price" })
            }

            if (currencyId) {
                if (currencyId !== 'INR') {
                    res.status(400).send({ status: false, message: 'Please provide currencyId in INR only' })
                    return
                }
            }

            if (currencyFormat) {
                if (currencyFormat !== '₹') {
                    res.status(400).send({ status: false, message: 'Please provide currencyFormat in format ₹ only' })
                    return
                }
            }

            if (isFreeShipping) {
                if (!(isFreeShipping == 'false' || isFreeShipping == 'true')) {
                    res.status(400).send({ status: false, message: 'Please provide valid isFreeShipping in boolean Form Only' })
                    return
                }
            }


            if (availableSizes) {
                let array = availableSizes.split(",").map(x => x.trim())
                console.log(array)
                for (let i = 0; i < array.length; i++) {
                    if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(array[i]))) {
                        return res.status(400).send({ status: false, msg: `Available sizes should be from these${["S", "XS", "M", "X", "L", "XXL", "XL"].join(',')}` })
                    }
                }

            }

            let files = req.files;
            if ((files && files.length > 0)) {
                const productImage = await uploadFile(files[0])
                let updateProduct = await productModel.findOneAndUpdate({ _id: productId }, { title: title, description: description, price: price, currencyId: currencyId, currencyFormat: currencyFormat, productImage: productImage, style: style, availableSizes: availableSizes, installments: installments, isFreeShipping: isFreeShipping }, { new: true });
                res.status(200).send({ status: true, message: "Successfully Updated", data: updateProduct });
            } else {
                let updateProduct = await productModel.findOneAndUpdate({ _id: productId }, { title: title, description: description, price: price, currencyId: currencyId, currencyFormat: currencyFormat, style: style, availableSizes: availableSizes, installments: installments, isFreeShipping: isFreeShipping }, { new: true });
                res.status(200).send({ status: true, message: "Successfully Updated", data: updateProduct });
            }
        }


    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message })
    }
}


const deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!productId) {
            return res.status(400).send({ status: false, message: "Please provide product Id" })
        }

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid product Id" })
        }

        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!findProduct) {
            return res.status(404).send({ status: false, message: "Product not found or it maybe deleted" })
        }

        const prodectDeleted = await productModel.findOneAndUpdate({ _id: productId }, { isDeleted: true, deletedAt: Date.now() }, { new: true })

        return res.status(200).send({ status: true, message: "Product deleted successfully", data: prodectDeleted })
    }
    catch (error) {
        res.status(500).send({ status: false, Error: "Server not responding", message: error.message, });
    }
}



module.exports = { productById, deleteProduct, createProduct, filterProduct, updateProduct }

