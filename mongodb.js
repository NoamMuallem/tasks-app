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

    // //will fetch a user from database with query
    // //with the callback function we can get error or the document itself
    // db.collection("users").findOne({ name: "Noam Muallem" }, (error, user) => {
    //   if (error) {
    //     return "unable to fined requested document";
    //   }

    //   console.log(user);
    // });

    // //no match is not an error but null!!!
    // db.collection("users").findOne({ name: "bob" }, (error, user) => {
    //   if (error) {
    //     return "unable to fined requested document";
    //   }

    //   console.log(user);
    // });

    // //to use a document id we need to pass an id OBJECT if not, we will get null
    // db.collection("users").findOne(
    //   { _id: new ObjectID("5e1991faf9dbf00833a576e5") },
    //   (error, user) => {
    //     if (error) {
    //       return "unable to fined requested document";
    //     }

    //     console.log(user);
    //   }
    // );

    //find return a currsor- pointer in the database to all the collections we fined
    //this gives us more flexability with the output
    //by usin toArray we can construct an arry from the currsore we got from fined
    db.collection("users")
      .find({ age: 27 })
      .toArray((error, users) => {
        console.log(users);
      });

    //lets see hoe mutch maches can we get
    db.collection("users")
      .find({ age: 27 })
      .count((error, count) => {
        console.log(count);
      });
  }
);
