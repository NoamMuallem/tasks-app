const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
  name: {
    type: String,
    //adding validation and sanatization
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true, //removing spaces before and after content
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("this email is unvalid");
      }
    }
  },
  age: {
    type: Number,
    defalt: 0,
    //costum validation, cant input a negative age
    validate(value) {
      if (value < 0) {
        throw new Error("age must be a positive number");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [7, "password is to short"],
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("invalid password");
      }
    }
  }
});

module.exports = User;
