import r from "rethinkdb";

const DB_NAME = "my_finances";

const createDB = async () => {
  try {
    const conn = await r.connect();
    r
      .dbList()
      .contains(DB_NAME)
      .do(databaseExists => {
        return r.branch(databaseExists, { dbs_created: 0 }, r.dbCreate(DB_NAME));
      })
      .run(conn);
  } catch (e) {
    console.log(e);
  }
};

const createTable = tableName => {
  try {
    let table = r.db(DB_NAME).table(tableName);
    r.db(DB_NAME).tableList().contains(tableName).do(
      r.branch(
        r.row,
        table,
        r.do(() => {
          return r.db(DB_NAME).tableCreate(tableName).do(() => {
            return table;
          });
        })
      )
    );
  } catch (e) {
    console.error(e);
  }
};

export const insertEntry = async entry => {
  try {
    const conn = await r.connect();
    await createDB();
    await createTable("entries");
    await r.db(DB_NAME).table("entries").insert(entry).run(conn);
  } catch (e) {
    console.error(e);
  }
};

// TODO: remove hard values and make this dynamic
export const updateEntry = async entry => {
  try {
    let newEntry = {
      category: "food",
      date: "november",
      value: 312
    };
    const conn = await r.connect();
    r
      .db(DB_NAME)
      .table("entries")
      .filter(r.row("id").eq("0a569d70-93e2-11e7-a296-d14a199c9c5f"))
      .update(newEntry)
      .run(conn, (err, result) => {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
      });
  } catch (e) {
    console.error(e);
  }
};
