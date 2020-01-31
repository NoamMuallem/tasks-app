const express = require("express");
require("./db/mongoose"); //starting database server
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

//app config
const app = express();
const port = process.env.PORT || 3000;

//setting up midelware to express for authentication BEFORE routing
//this function is going to run BEFORE the routing
// app.use((req, res, next) => {
//   console.log(req.method, req.path);

//   next();
// });

//automaticly pars incoming json
app.use(express.json());

//set up routers
app.use(userRouter);
app.use(taskRouter);

//fire up server
app.listen(port, () => {
  console.log("Server is up on port " + port);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const jwt = require("jsonwebtoken");

const myFunc = async () => {
  //creat a json web token, taks a uniqe key, a spesific passphrase and experation object
  const token = jwt.sign({ _id: "abc123" }, "bugovnkl", {
    expiresIn: "7 days"
  });

  console.log(token);

  const data = jwt.verify(token, "bugovnkl");

  console.log(data);
};

myFunc();
