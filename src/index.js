const express = require("express");
require("./db/mongoose"); //starting database server
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

//automaticly pars incoming json
app.use(express.json());

//creat task
app.post("/task", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

//creat user
app.post("/users", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
