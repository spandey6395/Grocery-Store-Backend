const mongoose = require('mongoose');
const userModel = require('../models/userModel')
const validator = require('../ middleware/validator')




const getUser = async function(req,res){
    try{
        const params = req.params
        const userId = params.userId

        if(!userId){
            res.status(400).send({status:false , message:"please enter UserId in params"})
        }

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg:"userId is incorrect" })
           }

    const user = await userModel.findOne({_id:userId , isDeleted:false})
    if(!user){
        res.status(404).send({status:false ,message:`User did not found with this ${userId} id` })
    }
    res.status(200).send({ status: true,  message: "User profile details",  data:user })
}
catch(error){
    console.log({status: false,  message: error.message})
    res.status(500).send({ status: false,  message: error.message })
}
}




module.exports = { getUser }