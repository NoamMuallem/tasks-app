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

    db.collection("users")
      .updateOne(
        {
          _id: new ObjectID("5e19997be416bfa88b3c08b7")
        },
        {
          //change the fileds in the document
          $set: {
            name: "bob"
          },
          //incrimating by 1
          $inc: {
            age: 1
          }
        }
      )
      .then(result => {
        ///promies fulfiled
        console.log(result);
      })
      .catch(error => {
        //promies rejected
        console.log(error);
      });

    //challenge: complite all the goals:
    db.collection("tasks")
      .updateMany(
        {
          completed: false
        },
        {
          $set: {
            completed: true
          }
        }
      )
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.log(error);
      });
  }
);
