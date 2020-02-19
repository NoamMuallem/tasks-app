const express = require("express");
require("./db/mongoose"); //starting database server
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

//app config
const app = express();

//automaticly pars incoming json
app.use(express.json());

//set up routers
app.use(userRouter);
app.use(taskRouter);

module.exports = app