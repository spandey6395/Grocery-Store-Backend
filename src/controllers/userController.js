const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { isValid, isValidObjectId, isValidRequestBody, nameRegex, passwordRegex,
  phoneRegex, emailRegex, } = require("../middleware/validator");
const orderModel = require("../models/orderModel");


const createUser = async function (req, res) {
  try {
    //reading input
    let body = req.body;
    let { fname, lname, phone, email, password  } = body;

    //empty request body
    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide input" });
    }

    //mandatory fields
    if (!isValid(fname)) {
      {
        return res
          .status(400)
          .send({ status: false, message: "Please provide fname" });
      }
    }

    if (!isValid(lname)) {
      {
        return res
          .status(400)
          .send({ status: false, message: "Please provide lname" });
      }
    }

    if (!isValid(email)) {
      {
        return res
          .status(400)
          .send({ status: false, message: "Please provide email" });
      }
    }

    if (!isValid(phone)) {
      {
        return res
          .status(400)
          .send({ status: false, message: "Please provide phone" });
      }
    }

    if (!isValid(password)) {
      {
        return res
          .status(400)
          .send({ status: false, message: "Please provide password" });
      }
    }
    if (!nameRegex.test(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid fname " });
    }

    if (!nameRegex.test(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid lname " });
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid emailId " });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Please provide a valid password - Password should include atleast one special character, one uppercase, one lowercase, one number and should be b/w 8-15 characters",
      });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).send({
        status: false,
        message: "Please provide a valid indian phone number "
      });
    }

    //unique key validation
    let checkEmail = await userModel.findOne({ email: body.email });
    if (checkEmail) {
      return res.status(400).send({
        status: false,
        message: `${body.email} already exist use different email`,
      });
    }
    let checkPhone = await userModel.findOne({ phone: body.phone });
    if (checkPhone) {
      return res.status(400).send({
        status: false,
        message: `${body.phone} already exist use different phone number`,
      });
    }

    //encrypt password
    let securePassword = body.password;

    const encryptedPassword = async function (securePassword) {
      const passwordHash = await bcrypt.hash(securePassword, 10);
      body.password = passwordHash;
    };
    encryptedPassword(securePassword);

    
    //create body
    let userCreated = await userModel.create(body);
    res.status(201).send({ status: true, message: "User created successfully", data: userCreated, });
  } catch (error) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      message: error.message,
    });
  }
};






const login = async function (req, res) {
  try {
    let body = req.body;
    const { email, password } = body;
    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "pls provide details to login" });
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "pls provide valid email" });
    }
    // regex validation for email

    if (!emailRegex.test(email)) {
      return res.status(400).send({
        status: false,
        message: `${email} should be a valid email address`,
      });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "pls provide valid password" });
    }

    // regex validation for password

    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        status: false,
        message: `Password length should be A Valid Password And Length Should Be in between 8 to 15 `,
      });
    }

    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(401)
        .send({ status: false, msg: "Invalid credentials" });
    }
    const passwordDetails = await bcrypt.compare(body.password, user.password);
    if (!passwordDetails) {
      return res.status(400).send({
        status: false,
        message: "password is incorrect pls provide correct passwords",
      });
    }
    // after sucessfully enter email and password ,create a token

    const token = jwt.sign(
      {
        userId: user._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 180,
      },
      "Group-48"
    );
    res.setHeader("Authorization", token);
    return res.status(200).send({
      status: true,
      message: "User login successfull",
      data: { userId: user._id, token: token },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, msg: error.message });
  }
};



const getUser = async function (req, res) {
  try {
    const params = req.params;
    const userId = params.userId;

    if (!userId) {
      res
        .status(400)
        .send({ status: false, message: "please enter UserId in params" });
    }

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "userId is incorrect" });
    }

    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).send({
        status: false,
        message: `User did not found with this ${userId} id`,
      });
    }
    res.status(200).send({ status: true, message: "User profile details", data: user });
  } catch (error) {
    console.log({ status: false, message: error.message });
    res.status(500).send({ status: false, message: error.message });
  }
};

const getuserwithmaxorder=async function(req,res){
  try{         
  let i;

           let maxOrder=items[0].quantity
           for( i=0;i<items.length;i++){
            if(maxOrder<items[i].quantity)
              maxOrder=items[i].quantity
            
          }
          let data1=await orderModel.findOne({items:items[i]})
          let userId=data1.userId;
          let person=await userModel.findById({_id:userId})
           res.status(200).send({status:true,msg:person})
         
           
}
 catch(error){
  console.log({ status: false, message: error.message });
  res.status(500).send({ status: false, message: error.message });

}
}




module.exports = { createUser, getUser, login, getuserwithmaxorder }
