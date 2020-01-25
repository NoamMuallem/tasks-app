const User = require("../models/user");
const express = require("express");
const router = new express.Router();

//creat user
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    //gonne run only is thar is no error and the promis is furfiled
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//get all the users on the database
router.get("/users", async (req, res) => {
  //just fetch all the user, no search ceriteria
  try {
    users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

//getting user with specific user id
router.get("/users/:id", async (req, res) => {
  //:id a dinemic key (a tool provided by express)
  const _id = req.params.id;
  try {
    user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

//update user by id
router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body); //all the fileds the user try to update
  const allowedUpdates = ["name", "email", "password"]; //all valid fileds to update
  const isValidOperetion = updates.every(update =>
    allowedUpdates.includes(update)
  ); //will be true if onle EVERY string in the updates array is included in allowedUpdates

  if (!isValidOperetion) {
    return res.status(400).send({ error: "invalid update field" });
  }

  try {
    //takes the id the changes and option object- we get in return the NEW updated object and run the validation on the updated values
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    //error in validation on new user
    res.status(400).send();
  }
});

//delete user by id
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
