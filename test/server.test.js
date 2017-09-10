import chai from "chai";
import chaiHttp from "chai-http";
import uuidv1 from "uuid/v1";
import server from "../server";

import { insertInto, getById, deleteFrom, updateInto, getAll } from "../db/config";

const { expect } = chai;
chai.use(chaiHttp);

let entry = {
  id: uuidv1(),
  date: "November",
  title: "Gas",
  value: 43
};

// Wraping twice https://github.com/mochajs/mocha/issues/2407#issuecomment-271240528
describe("Entry", () => {
  it("should create new entry", async () => {
    await insertInto(entry, "entries");
    let savedEntry = await getById(entry.id, "entries");
    expect(savedEntry).to.not.be.null;
  });
});

describe("Update Entry", () => {
  it("should update entry", async () => {
    await insertInto(entry, "entries");
    entry.title = "Market";
    await updateInto(entry, "entries");
    let updatedEntry = await getById(entry.id, "entries");
    expect(updatedEntry.title).to.equal("Market");
  });
});

describe("GET ALL Entry", () => {
  it("should get every entry", async () => {
    let entries = await getAll("entries");
    expect(entries).to.not.be.null;
  });
});

describe("Delete Entry", () => {
  it("should delete entry", async () => {
    await insertInto(entry, "entries");
    await deleteFrom(entry.id, "entries");
    let updatedEntry = await getById(entry.id, "entries");
    expect(updatedEntry).to.equal(null);
  });
});
