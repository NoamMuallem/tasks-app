//crud creat read update delet

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID
//by using destructuring we can simplify the code
const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "tesk-manager";

const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());

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
    //----------------adding one user at a time-----------------------
    //adding new collection to the db, again will be created for us when we try to access it
    //also asychronus function
    db.collection("users").insertOne(
      {
        _id: id,
        name: "Noam Muallem",
        age: 27
      },
      //the callback and result are defined in the documentetion of the apii
      (error, result) => {
        if (error) {
          return console.log("unable to add user");
        }

        console.log(result.ops);
      }
    );

    //     //-----------------adding many users at a time---------------
    // db.collection("users").insertMany(
    //   [
    //     {
    //       name: "jan",
    //       age: 28
    //     },
    //     {
    //       name: "avi",
    //       age: 24
    //     }
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("unable to insert documents");
    //     }

    //     console.log(result.ops);
    //   }
    // );

    // //chalenge, add mane documents to new tasks collection
    // db.collection("tasks").insertMany(
    //   [
    //     {
    //       description: "buy grosheries",
    //       completed: true
    //     },
    //     {
    //       description: "do homework",
    //       completed: false
    //     },
    //     {
    //       description: "make dinner",
    //       completed: true
    //     }
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log("unable to add tasks");
    //     }

    //     console.log(result.ops);
    //   }
    // );
  }
);
