const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    //adding validation and sanatization
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
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
  },
  tokens: [
    {
      //for all the token this user currently have (if he is login from multiple devices)
      token: {
        type: String,
        required: true
      }
    }
  ]
});

//generating user authentication token SPECIFIC OBJECT METHODS LIVA IN METHODS
userSchema.methods.generateAuthToken = async function() {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, "bugovnkl");

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

//user login MODEL FUNCTION LIVE IN STATICS
userSchema.statics.findByCredentials = async (email, password) => {
  //lok for user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("unable to login");
  }

  //is was found by email, chack if password is like on the db
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("unable to login");
  }

  return user;
};

//hash the plain text password
userSchema.pre("save", async function(next) {
  const user = this;

  //if thar is a new password(by creating or updaing), we have to hash it:
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  //when we done, not gonne save the user if not called
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
