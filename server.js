import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { insertEntry, updateEntry } from "./db/config";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const port = isProduction ? process.env.PORT : 3001;
const publicPath = path.resolve(__dirname, "./client/build");

app.use(bodyParser.json());

// We point to our static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(publicPath));
}

app.post("/entries", (req, res) => {
  try {
    let entry = req.body;
    insertEntry(entry);
    res.status(200).send("Entry inserted with success").end();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.put("/entries", (req, res) => {
  try {
    let entry = req.body;
    updateEntry(entry);
    res.status(200).send("Entry inserted with success").end();
  } catch (e) {
    res.status(400).send(e);
  }
});

// And run the server
app.listen(port, () => {
  console.log("Server running on port " + port);
});

export default app;
