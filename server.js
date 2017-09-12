import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { insertInto, updateInto, deleteFrom, getAll } from "./db/config";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const port = isProduction ? process.env.PORT : 3001;
const publicPath = path.resolve(__dirname, "./client/build");

app.use(bodyParser.json());

// We point to our static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(publicPath));
}

/**
 * INCOME
 *
 */

app.get("/income", async (req, res) => {
  try {
    let incomes = await getAll("incomes");
    res
      .status(200)
      .send(incomes)
      .end();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/income", (req, res) => {
  try {
    let income = req.body;
    insertInto(income, "incomes");
    res
      .status(200)
      .send("Income inserted with success")
      .end();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.put("/income", (req, res) => {
  try {
    let income = req.body;
    updateInto(income, "incomes");
    res
      .status(200)
      .send("Income updated with success")
      .end();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete("/income/:id", (req, res) => {
  let id = req.params.id;
  try {
    deleteFrom(id, "incomes");
    res
      .status(200)
      .send("Income deleted with success")
      .end();
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * EXPENSES
 *
 */

app.get("/expense", async (req, res) => {
  try {
    let expenses = await getAll("expenses");
    res
      .status(200)
      .send(expenses)
      .end();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/expense", (req, res) => {
  try {
    let expense = req.body;
    insertInto(expense, "expenses");
    res
      .status(200)
      .send("Expense inserted with success")
      .end();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.put("/expense", (req, res) => {
  try {
    let expense = req.body;
    updateInto(expense, "expenses");
    res
      .status(200)
      .send("Expense updated with success")
      .end();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete("/expense/:id", (req, res) => {
  let id = req.params.id;
  try {
    deleteFrom(id, "expenses");
    res
      .status(200)
      .send("Expense deleted with success")
      .end();
  } catch (e) {
    res.status(400).send(e);
  }
});

// And run the server
app.listen(port, () => {
  console.log("Server running on port " + port);
});

export default app;
