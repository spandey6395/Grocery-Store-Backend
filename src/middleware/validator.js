const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidFiles = function (files) {
  if (files && files.length > 0) return true;
};

const alphabetOnlyRegex = /^[a-zA-Z]{2,30}$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

const pincodeRegex = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;

const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

module.exports = {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidFiles,
  alphabetOnlyRegex,
  passwordRegex,
  phoneRegex,
  pincodeRegex,
  emailRegex,
};
