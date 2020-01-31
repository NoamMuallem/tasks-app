const Task = require("../models/task");
const express = require("express");
const router = new express.Router();

//creat task
router.post("/task", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//get all the tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.statuse(500).send();
  }
});

//get task by id
router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

//update task by id
router.patch("/tasks/:id", async (req, res) => {
  //checks that update fileds are valid - if not informing the user
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperetion = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperetion) {
    res.status(400).send({ error: "unvalid updating filed" });
  }
  //if valid update parameters
  try {
    //changing to make it save() than go to middelman
    const task = await Task.findById(req.params.id);
    updates.forEach(update => {
      task[update] = req.body[update];
    });

    await task.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    //if no task with that id was fount
    if (!task) {
      return res.status(404).send();
    }

    //if ther was a task with that id
    res.send(task);
  } catch (e) {
    //if invalid changes like password to short or something
    res.status(400).send();
  }
});

//delete task by id
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
