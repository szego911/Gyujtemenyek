const express = require("express");
const { connectToDb, getDb } = require("./db");
const cors = require("cors");

const app = express();
app.use(cors());

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(8080, () => {
      console.log("Connected to the database");
    });
    db = getDb();
  }
});

app.get("/collections", (req, res) => {
  let collections = [];

  db.collection("collections")
    .find()
    .forEach((collection) => {
      collections.push(collection);
    })
    .then(() => {
      res.status(200).json(collections);
    })
    .catch((err) => {
      //res.status(500).json(err);
    });
});

app.get("/items", (req, res) => {
  let items = [];

  db.collection("items")
    .find()
    .forEach((item) => {
      items.push(item);
    })
    .then(() => {
      res.status(200).json(items);
    })
    .catch((err) => {
      //res.status(500).json(err);
    });
});
