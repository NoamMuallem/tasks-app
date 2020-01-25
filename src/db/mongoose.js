const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://127.0.0.1:27017/tasks-manager-api",
  //"mongodb+srv://bugovnkl:bugovnkl@cluster0-jxntp.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);
