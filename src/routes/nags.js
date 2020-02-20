const router = require("express").Router();
const {sendSMSToMultiplePeople} = require("../helpers/sendMessages");


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

// this route returns an array of objects of the phone numbers of the 
// friends of the user when the nag was incomplete on the day
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
          // we really need the two phone numbers below
          ` 
            SELECT * FROM goals
              WHERE goals.id IN (${goalIdfind(nags)})
              ;
              `
        ).then(({ rows: goals }) => {
          response.json(goals);
        });

      }).catch(err => {console.error(err)})
 });

// morning nags
// friends of the user when the nag was incomplete on the day
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
        
        //we really need the phone number of the users
        ` 
          SELECT * FROM users
          JOIN goals ON user_id = users.id
          WHERE goals.id IN (${goalIdfind(nags)})
            ;
            `
      ).then(({ rows: goals }) => {
        response.json(goals)
        sendSMSToMultiplePeople(goals)
      });

    }).catch(err => {console.error(err)})
});


  // router.get("/goals/withgoalid", (request, response) => {
  //   const goalIdFindArr = goalIdfind(nags);
  //   db.query(
  //     `
  //       SELECT friend_1_phone_number, friend_2_phone_number FROM goals
  //         WHERE goals.id = ANY(${sql.array(goalIdFindArr, "int4")})
  //         ;
  //         `
  //   ).then(({ rows: goals }) => {
  //     response.json(goals);
  //   });
  // });
  return router;
};
