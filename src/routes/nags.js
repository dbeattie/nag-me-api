const router = require("express").Router();
const {
  sendSMSToMultiplePeople6AM,
  sendSMSToMultiplePeople12AM
} = require("../helpers/sendMessages");

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

  // this route sends a message to the
  // friends of the user when the nag was incomplete at midnight day
  router.get("/nags/incomplete/eveningnags", (request, response) => {
    db.query(
      `
    SELECT * FROM nags
    WHERE completion = false
    AND date = current_date ;
      `
    )
      .then(({ rows: nags }) => {
        // response.json(nags);
        const goalIdfind = arr => {
          let goalIdArr = [];
          arr.forEach(element => {
            goalIdArr.push(element.goal_id);
          });
          return goalIdArr;
        };
        db.query(
          ` 
          SELECT * FROM users
          JOIN goals ON user_id = users.id
          WHERE goals.id IN (${goalIdfind(nags)})
            ;`
        ).then(({ rows: goals }) => {
          response.json(goals);
          sendSMSToMultiplePeople12AM(goals);
        });
      })
      .catch(err => {
        console.error(err);
      });
  });

  // morning nags
  // send to users at the begining of the day
  router.get("/nags/incomplete/morningnags", (request, response) => {
    db.query(
      `
    SELECT * FROM nags
    WHERE completion = false
    AND date = current_date ;
    `
    )
      .then(({ rows: nags }) => {
        // response.json(nags);
        const goalIdfind = arr => {
          let goalIdArr = [];
          arr.forEach(element => {
            goalIdArr.push(element.goal_id);
          });
          return goalIdArr;
        };
        db.query(
          ` 
          SELECT * FROM users
          JOIN goals ON user_id = users.id
          WHERE goals.id IN (${goalIdfind(nags)})
            ;
            `
        ).then(({ rows: goals }) => {
          response.json(goals);
          //sendSMSToMultiplePeople6AM(goals)
        });
      })
      .catch(err => {
        console.error(err);
      });
  });

  return router;
};
