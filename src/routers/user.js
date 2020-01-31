const User = require("../models/user");
const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();

////////////no authentication needed/////////////
//creat user
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();

    res.send({
      user,
      token
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

//user logout from one session
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      token.token !== req.token;
    }); //keep all tokens that dont belong to this session

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//user logout of ALL sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//user login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({
      user,
      token
    });
  } catch (e) {
    res.status(400).send();
  }
});

//////////////authentication needed//////////////
//get all the users on the database
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
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
    const user = await User.findById(req.params.id);

    //accesing an unknown propperty
    updates.forEach(update => (user[update] = req.body[update]));

    //makeing sure we will call user.save so we can hash a new password if needed
    await user.save();

    //takes the id the changes and option object- we get in return the NEW updated object and run the validation on the updated values
    //const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

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
