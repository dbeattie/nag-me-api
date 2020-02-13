const router = require("express").Router();

module.exports = db => {
  router.get("/nags", (request, response) => {
    db.query(
      `
      SELECT
        nags.id,
        nags.name,
        array_agg(DISTINCT appointments.id) AS appointments,
        array_agg(DISTINCT available_interviewers.interviewer_id) AS interviewers,
        (SELECT sum(CASE WHEN interviews.id IS NULL THEN 1 ELSE 0 END) FROM appointments LEFT JOIN interviews ON interviews.appointment_id = appointments.id WHERE appointments.day_id = nags.id)::int AS spots
      FROM nags
      JOIN appointments ON appointments.day_id = nags.id
      JOIN available_interviewers ON available_interviewers.day_id = nags.id
      GROUP BY nags.id
      ORDER BY nags.id
    `
    ).then(({ rows: nags }) => {
      response.json(nags);
    });
  });

  return router;
};
