const router = require("express").Router();

module.exports = db => {
  router.get("/nags", (request, response) => {
    db.query(
      `
      SELECT * FROM nags ORDER BY nags.id
      `
    ).then(({ rows: nags }) => {
      response.json(nags);
    });
  });

  return router;
};
