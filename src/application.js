const fs = require("fs");
const path = require("path");
const cookieSession = require("cookie-session")
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
// const auth = require("./routes/auth");

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
  app.use(cors({origin: 'http://localhost:3000', credentials: true}));
  app.use(helmet());
  app.use(bodyparser.json());

  app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
    
  }));

  app.use("/api", users(db));
  app.use("/api", goals(db));
  app.use("/api", nags(db));
  app.use("/api", login(db));
  app.use("/api", register(db));
  app.use("/api", logout(db));
  // app.use("/api", auth);

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
            .catch(error => console.log(error));
        });
      })
      .catch(error => {
        console.log(`Error setting up the reset route: ${error}`);
      });
  }

  app.close = function() {
    return db.end();
  };

  return app;
};
