const express = require("express");
require("./db/mongoose"); //starting database server
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

//app config
const app = express();
const port = process.env.PORT || 3000;

//automaticly pars incoming json
app.use(express.json());

//set up routers
app.use(userRouter);
app.use(taskRouter);

//fire up server
app.listen(port, () => {
  console.log("Server is up on port " + port);
});
