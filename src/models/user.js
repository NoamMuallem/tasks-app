const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
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
    ],
    avatar: {
      type: Buffer //bineries for image
    }
  },
  {
    timestamps: true
  }
);

//setting relationship between tasks and user, not an actual filed in user, therfore virtual
userSchema.virtual("tasks", {
  ref: "Task", //just so mongoose can figur out what is owned by what and thair relations
  localField: "_id",
  foreignField: "owner" //he fileds that connects the 2 documents (like in sql keys)
});

//chacking if a user update filed is valid, returns fals is an unvalid filed was entered
userSchema.statics.isValidUpdate = updates => {
  const allowedUpdates = ["name", "email", "password"]; //all valid fileds to update
  const isValidOperetion = updates.every(update =>
    allowedUpdates.includes(update)
  ); //will be true if onle EVERY string in the updates array is included in allowedUpdates
  return isValidOperetion;
};

//generating user authentication token SPECIFIC OBJECT METHODS LIVA IN METHODS
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

//make sure hat when we send user back it will not contain the password and tokens
userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar; //data is to big, slow down json requests and not needed

  return userObject;
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
userSchema.pre("save", async function (next) {
  const user = this;

  //if thar is a new password(by creating or updaing), we have to hash it:
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  //when we done, not gonne save the user if not called
  next();
});

//delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
