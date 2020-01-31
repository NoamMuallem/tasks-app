const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    //if thar is a token replace str 'Brear' with nothing, if not replace() will throw an error that we can catch
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "bugovnkl");

    //the token contains the user id
    //search for a user with that id and that have this token in his tokens array
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });

    if (!user) {
      throw new Error(""); //will triger catch
    }

    //addind the new user we found to the requst so that the rout hendler can use it
    req.user = user;
    //addind token as well to req so we can log out from that specific session
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "please authenticate." });
  }
};

module.exports = auth;
