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

//get all the users on the database
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//update my user
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  if (!User.isValidUpdate(updates)) {
    //making sure a requested update filed is a valid field
    return res.status(400).send({ error: "invalid update field" });
  }

  try {
    const user = req.user;
    updates.forEach(update => (user[update] = req.body[update])); //accesing an unknown propperty
    await user.save(); //makeing sure we will call user.save() so we can hash a new password if needed

    res.send(user);
  } catch (e) {
    //error in validation on new user
    res.status(400).send();
  }
});

//delete mt user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
