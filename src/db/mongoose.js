const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/tasks-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const User = mongoose.model("User", {
  name: {
    type: String
  },
  age: {
    type: Number
  }
});

const Task = mongoose.model("Task", {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
});

// //creat a new user
// const me = new User({
//   name: "Noam Muallem",
//   age: 27
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
  description: "do homework",
  completed: false
});

task
  .save()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  });
