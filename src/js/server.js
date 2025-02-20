const express = require("express");
const { connectToDb, getDb } = require("./db");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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

const formatDate = (date) => {
  const isoString = date.toISOString();
  const formattedDate = isoString.split("T")[0];
  return formattedDate;
};

//TODO: create CUD endpints

// Add a new document to the collection
app.post("/insertcollection", async (req, res) => {
  let collection = await db.collection("collections");

  try {
    let newDocument = req.body;
    let result = collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (e) {
    console.err(e);
  }
});

app.post("/insertitem", async (req, res) => {
  let items = await db.collection("items");

  try {
    let newDocument = req.body;
    let result = items.insertOne(newDocument);
    res.send(result).status(204);
  } catch (e) {
    console.err(e);
  }
});

// Update the post with a new comment
app.patch("/updatecollection/:name", async (req, res) => {
  const query = { _id: ObjectId(req.params.name) };
  const updates = {
    $push: { comments: req.body },
  };
  let collection = await db.collection("collections");
  let result = await collection.updateOne(query, updates);
  res.send(result).status(200);
});

// Delete an entry
app.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const collection = db.collection("posts");
  let result = await collection.deleteOne(query);
  res.send(result).status(200);
});
