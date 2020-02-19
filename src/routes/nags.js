const router = require("express").Router();

module.exports = db => {
  router.get("/nags", (request, response) => {
    db.query(
      `
        SELECT * FROM nags ORDER BY nags.id;
      `
    ).then(({ rows: nags }) => {
      response.json(nags);
    });
  });

  router.get("/nags/incomplete", (request, response) => {
    db.query(
      `
    SELECT * FROM nags
    WHERE completion = false
    AND date = current_date ;
      `
    ).then(({ rows: nags }) => {
      response.json(nags);
    });
  });

  
  return router;
};

