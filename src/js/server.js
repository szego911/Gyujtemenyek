const express = require("express");
const { connectToDb, getDb } = require("./db");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(cors());
app.use(express.json());

let db;
const url = "http://localhost:8080";

connectToDb((err) => {
  if (!err) {
    app.listen(8080, "0.0.0.0", () => {
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
      res.status(500).json(err);
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
      res.status(500).json(err);
    });
});

app.post("/insertcollection", async (req, res) => {
  let collection = await db.collection("collections");

  try {
    let newDocument = req.body;
    let result = collection.insertOne(newDocument);
    res.send(result).status(200);
  } catch (e) {
    console.err(e);
  }
});

app.post("/insertitem", async (req, res) => {
  let items = await db.collection("items");

  try {
    let newDocument = req.body;
    let result = items.insertOne(newDocument);
    res.send(result).status(200);
  } catch (e) {
    console.err(e);
  }
});

app.patch("/update/collection", async (req, res) => {
  const query = { _id: new ObjectId(req.body.collectionId.toString()) };
  const updates = {
    $set: { name: req.body.name },
  };
  let collection = await db.collection("collections");
  let result = await collection.updateOne(query, updates);
  res.status(200);
});

app.patch("/update/item", async (req, res) => {
  const query = { _id: new ObjectId(req.body.itemId) };
  const updates = {
    $set: { name: req.body.name },
  };

  let collection = await db.collection("items");
  let result = await collection.updateOne(query, updates);
  res.status(200);
});

app.delete("/delete/item", async (req, res) => {
  const name = req.body.name;
  const collection = db.collection("items");
  let result = await collection.deleteOne({ name: name });
  res.send(result).status(200);
});
