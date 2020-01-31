const Task = require("../models/task");
const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

//creat task
router.post("/task", auth, async (req, res) => {
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

//get all the tasks for this user
router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
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
