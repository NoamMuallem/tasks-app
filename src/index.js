const express = require("express");
require("./db/mongoose"); //starting database server
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

//automaticly pars incoming json
app.use(express.json());

//get all the tasks
app.get("/tasks", (req, res) => {
  Task.find({})
    .then(Tasks => {
      res.send(Tasks);
    })
    .catch(e => {
      res.status(500).send();
    });
});

//get task by id
app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;

  Task.findById(_id)
    .then(task => {
      if (!task) {
        return res.status(404).send();
      }

      res.send(task);
    })
    .catch(e => {
      res.status(500);
    });
});

//get all the users on the database
app.get("/users", (req, res) => {
  //just fetch all the user, no search ceriteria
  User.find({})
    .then(Users => {
      res.send(Users);
    })
    .catch(e => {
      res.status(500).send();
    });
});

//getting user with specific user id
app.get("/users/:id", (req, res) => {
  //:id a dinemic key (a tool provided by express)
  const _id = req.params.id;

  User.findById(_id)
    .then(user => {
      //is database is successfuly accesed and no user with that id was found
      if (!user) {
        return res.status(404).send();
      }

      //if a user was found with that id
      res.send(user);
    })
    .catch(e => {
      res.status(500).send();
    });
});

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
