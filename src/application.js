const fs = require("fs");
const path = require("path");
const cookieSession = require("cookie-session");
const express = require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const db = require("./db");
const users = require("./routes/users");
const goals = require("./routes/goals");
const nags = require("./routes/nags");
const login = require("./routes/login");
const register = require("./routes/register");
const logout = require("./routes/logout");

function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      {
        encoding: "utf-8"
      },
      (error, data) => {
        if (error) return reject(error);
        resolve(data);
      }
    );
  });
}

module.exports = function application(ENV) {
  /*cors is currently hardcoded, it will fail if we push this condition to a new Heroku database or netlify --> Can create an array that should tolerate multiple URL's but will need to look up documentation*/
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(helmet());
  app.use(bodyparser.json());

  app.use(
    cookieSession({
      name: "session",
      keys: ["key1", "key2"]
    })
  );

  app.use("/api", users(db));
  app.use("/api", goals(db));
  app.use("/api", nags(db));
  app.use("/api", login(db));
  app.use("/api", register(db));
  app.use("/api", logout(db));

  if (ENV === "development" || ENV === "test") {
    Promise.all([
      read(path.resolve(__dirname, `db/schema/create.sql`)),
      read(path.resolve(__dirname, `db/schema/${ENV}.sql`))
    ])
      .then(([create, seed]) => {
        app.get("/api/debug/reset", (request, response) => {
          db.query(create)
            .then(() => db.query(seed))
            .then(() => {
              console.log("Database Reset");
              response.status(200).send("Database Reset");
            })
            .catch(error => console.error(error));
        });
      })
      .catch(error => {
        console.error(`Error setting up the reset route: ${error}`);
      });
  }

  app.close = function() {
    return db.end();
  };

  return app;
};
