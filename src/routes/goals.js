const router = require("express").Router();

module.exports = db => {
  router.get("/goals", (request, response) => {
    db.query(`SELECT * FROM goals ORDER BY goals.id`).then(({ rows: goals }) => {
      response.json(
        goals.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
  });

  return router;
};
