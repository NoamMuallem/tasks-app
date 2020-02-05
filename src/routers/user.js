const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
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

/////////////////avatar photo upload///////////////////

//setting up the upload behavior
const upload = multer({
  //dest: "avatars" - if not set, will pass the data throw so we can use it in the rout itself and save it to user
  limits: {
    //restricting the upload size
    fileSize: 1000000 //in byts
  },
  fileFilter(req, file, cb) {
    //es6 function, gets the request, the file and cd, a callback function for when we done
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      //using with regular expretions- the '\' is for escaping the '.','$' is to specify that thar are no characters after this regular expration
      return cb(new Error("please upload an image"));
    }
    cb(undefined, true); //valid upload
  }
});

//upload image can be uses to creat or update
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer) //returns from the cb on fileFilter, buffer- contains binerys for file
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer(); //using sharp to convert photo to png format and to 250X250 size
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    //for rout error handeling
    res.status(400).send({ error: error.message });
  }
);

//delete user avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

//get user avatar image
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      //if thar is no user or user photo
      throw new Error();
    }

    res.set("Content-Type", "image/jpg"); //response header
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
