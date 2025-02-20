const { MongoClient } = require("mongodb");
require('dotenv').config()

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(process.env.MONGODB_CONNECTION_STRING)
      .then((client) => {
        dbConnection = client.db("gyujtemenyek");
        return cb();
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        return cb();
      });
  },
  getDb: () => dbConnection,
};
