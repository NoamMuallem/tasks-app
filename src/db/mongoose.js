const mongoose = require("mongoose");
//external validator librery, mutch more extensive then mongoose costum validation
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/tasks-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

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

const Task = mongoose.model("Task", {
  description: {
    type: String,
    trim: true,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

// //creat a new user, chacking validation
// const me = new User({
//   name: "        Noam   ",
//   age: 80,
//   email: "MYEMAIL@git.il                             ",
//   password: "PASSWORD"
// });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch(error => {
//     console.log("Error", error);
//   });

//creat new task
const task = new Task({
  description: "make plains"
});

task
  .save()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });
