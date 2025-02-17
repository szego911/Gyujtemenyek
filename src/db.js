const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(
      "mongodb+srv://user123:user123@szego911.7qsot.mongodb.net/?retryWrites=true&w=majority&appName=szego911"
    )
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
