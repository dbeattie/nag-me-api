const router = require("express").Router();
const {
  sendSMSToMultiplePeople6AM,
  sendSMSToMultiplePeople12AM
} = require("../helpers/sendMessages");

//IF YOU'RE WORKING ON ROUTES USE req/res convention!!!

module.exports = db => {
  router.get("/nags", async (req, res) => {
    try {
      // console.log({ session: req.session })
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const nagsQuery = `
        SELECT nags.id as ID, goal_id, nag_name, completion, to_char(date,'FMMonth FMDDth, YYYY') as date
        FROM nags 
        JOIN goals ON goal_id = goals.id
        WHERE user_id = $1
        AND date >= current_date 
        AND completion IS NULL 
        ORDER BY ID;
        `
      const data = await db.query(nagsQuery, [req.session.userId]);
      // console.log(data.rows);
      res.json(data.rows);

    } catch(error) {
      console.log(error)
    }
  });

  // this route sends a message to the
  // friends of the user when the nag was incomplete at midnight day
  router.get("/nags/incomplete/eveningnags", (req, res) => {
    db.query(
      `
    SELECT * FROM nags
    WHERE completion = false
    AND date = current_date ;
      `
    )
      .then(({ rows: nags }) => {
        // res.json(nags);
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
          res.json(goals);
          sendSMSToMultiplePeople12AM(goals);
        });
      })
      .catch(err => {
        console.error(err);
      });
  });

  // morning nags
  // send to users at the begining of the day
  router.get("/nags/incomplete/morningnags", (req, res) => {
    db.query(
      `
    SELECT * FROM nags
    WHERE completion = false
    AND date = current_date ;
    `
    )
      .then(({ rows: nags }) => {
        // res.json(nags);
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
          res.json(goals);
          //sendSMSToMultiplePeople6AM(goals)
        });
      })
      .catch(err => {
        console.error(err);
      });
  });

  //logic to update the server so nag equals true
  router.post("/nags/toggletrue", (req, res) => {
    console.log("toggle true req body is ",req.body);
    db.query(
      `
      UPDATE nags
      SET completion = true
      WHERE id = $1;
      `, [req.body.id]
      ).then(result => {
        console.log("result of toggle true ", result)
        res.json(result.data);
    });
  });

  //logic to update the server so nag equals false
  router.post("/nags/togglefalse", (req, res) => {
    // console.log(req.body);
    db.query(
      `
        UPDATE nags
        SET completion = false
        WHERE id = $1;
        `, [req.body.id]
    ).then(result => {
      res.json(result.data);
    });
  });
  return router;
};
