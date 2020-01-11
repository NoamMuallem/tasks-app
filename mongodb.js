//crud creat read update delet

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID
//by using destructuring we can simplify the code
const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "tesk-manager";

//asynchronus function
MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log("unable to connect to database");
    }

    //creating new database, by trying to access it, it will be created for us
    const db = client.db(databaseName);

    // db.collection("users")
    //   .deleteMany({
    //     age: 27
    //   })
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    //challenge delete one task
    db.collection("tasks")
      .deleteOne({
        description: "make dinner"
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }
);
