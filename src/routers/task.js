const Task = require("../models/task");
const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

//creat task
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body, //copy over all the fileds from req.body to the object
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Get /tasks?completed=true
//Get /tasks?limit=10&skip=3(page 3, 10 resolts=> show 20-29)
//Get /tasks?sortBy=createdAt:asc/desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    //we get a string from req.query.completed, if the string equals to the string 'true'
    //we will save that value and use that
    //if nothing was provided we will get null and not populate match, so we will get all the tasks we have
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    //sort by unknown field, accessing it with[], short if statmant to assighn 1 or -1 depending on the str in part[1]
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        //match risolts to be true false or everything
        match,
        options: {
          //limit the amount of the resolts given need to be a number, not a string, will be ignored if no limit spesefied
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.page) * parseInt(req.query.limit), // set to skip pages, not single tasks
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.statuse(500).send();
  }
});

//get task by id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id }); //get the task with that id that was created by THIS user
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

//update task by id
router.patch("/tasks/:id", auth, async (req, res) => {
  //checks that update fileds are valid - if not informing the user
  const updates = Object.keys(req.body);

  if (!Task.isValidUpdate(updates)) {
    res.status(400).send({ error: "unvalid updating filed" });
  }
  //if valid update parameters
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    //if no task with that id was fount
    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => {
      task[update] = req.body[update];
    });
    await task.save();

    //if ther was a task with that id
    res.send(task);
  } catch (e) {
    //if invalid changes like password to short or something
    res.status(400).send();
  }
});

//delete task by id
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
