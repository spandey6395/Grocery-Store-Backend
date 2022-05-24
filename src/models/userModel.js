const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      shipping: {
        street: {
          type: String,

          trim: true,
        },
        city: {
          type: String,

          trim: true,
        },
        pincode: {
          type: Number,

          trim: true,
        },
      },

      billing: {
        street: {
          type: String,

          trim: true,
        },
        city: {
          type: String,

          trim: true,
        },
        pincode: {
          type: Number,

          trim: true,
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userModel);
