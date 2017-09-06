import express from "express";
import path from "path";

let r = require("rethinkdb");
r.connect({ host: "localhost", port: 28015 }, function(err, conn) {
  if (err) throw err;
  r
    .db("test")
    .tableCreate("tv_shows")
    .run(conn, function(err, res) {
      if (err) throw err;
      console.log(res);
      r
        .table("tv_shows")
        .insert({ name: "Star Trek TNG" })
        .run(conn, function(err, res) {
          if (err) throw err;
          console.log(res);
        });
    });
});

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const port = isProduction ? process.env.PORT : 3001;
const publicPath = path.resolve(__dirname, "./client/build");

// We point to our static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(publicPath));
}

// Do not know if we need this
//app.use(fallback("index.html", { root: publicPath }));

// And run the server
app.listen(port, function() {
  console.log("Server running on port " + port);
});

export default app;
