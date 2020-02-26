const router = require("express").Router();
const {
  sendSMSToMultiplePeople6AM,
  sendSMSToMultiplePeople12AM
} = require("../helpers/sendMessages");
const { goalIdfind } = require("../helpers/goalIdFind");

//IF YOU'RE WORKING ON ROUTES USE req/res convention!!!
//*****************************************************

module.exports = db => {
  router.get("/nags", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const nagsQuery = `
        SELECT nags.id as ID, goal_id, nag_name, completion, date, to_char(date,'FMMonth FMDDth, YYYY') as simple_date
        FROM nags 
        JOIN goals ON goal_id = goals.id
        WHERE user_id = $1
        AND date >= current_date 
        AND completion IS NULL 
        ORDER BY ID;
        `;
      const data = await db.query(nagsQuery, [req.session.userId]);
      res.json(data.rows);
    } catch (error) {
      console.error(error);
    }
  });
  // Route that returns data from nags table that can be used for graphing
  // *********************************************************************
  router.get("/nags/completiondata", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const nagsQuery = `
        SELECT nags.id as ID, goal_id, nag_name, completion, to_char(date,'FMMonth FMDDth, YYYY') as date
        FROM nags 
        JOIN goals ON goal_id = goals.id
        WHERE user_id = $1
        ORDER BY ID;
        `;
      const data = await db.query(nagsQuery, [req.session.userId]);
      // function that counts the number of nags that are true, false and null for graphing
      // **********************************************************************************
      let nagTrueCount = 0;
      let nagFalseCount = 0;
      let nagNullCount = 0;
      data.rows.forEach(element => {
        if (element.completion === true) {
          nagTrueCount++;
        } else if (element.completion === false) {
          nagFalseCount++;
        } else if (element.completion === null) {
          nagNullCount++;
        }
      });
      res.json({ nagTrueCount, nagFalseCount, nagNullCount });
    } catch (error) {
      console.error(error);
    }
  });

  // this route sends a message to the
  // friends of the user when the nag was incomplete at midnight day
  //****************************************************************
  router.get("/nags/incomplete/eveningnags", async (req, res) => {
    try {
      const eveningNagData = await db.query(
        `
      SELECT * FROM nags
      WHERE completion IS NOT true
      AND date = current_date;
      `
      );
      if (eveningNagData.rows.length > 0) {
        const findUsers = await db.query(
          ` 
          SELECT * FROM users
          JOIN goals ON user_id = users.id
          WHERE ARRAY[goals.id] <@ $1
            ;`,
          [goalIdfind(eveningNagData.rows)]
        );
          res.json(findUsers.rows);
          sendSMSToMultiplePeople12AM(findUsers.rows);
        } else { console.log("Your evening nag query is empty!"), res.json([])}   
    } catch(error) {
      console.error(error);
      res.status(500).json(error);
    }
  });

  // morning nags
  // send to users at the begining of the day
  //****************************************
  router.get("/nags/incomplete/morningnags", async (req, res) => {
    try {
      const morningNagData = await db.query(
        `
      SELECT * FROM nags
      WHERE completion IS NOT true
      AND date = current_date;
      `
      );
      if (morningNagData.rows.length > 0) {
        const findUsers = await db.query(
          ` 
          SELECT * FROM users
          JOIN goals ON user_id = users.id
          WHERE ARRAY[goals.id] <@ $1
            ;`,
          [goalIdfind(morningNagData.rows)]
        );
          res.json(findUsers.rows);
          sendSMSToMultiplePeople6AM(findUsers.rows);
        } else { console.log("Your morning nag query is empty!"), res.json([])}   
    } catch(error) {
      console.error(error);
      res.status(500).json(error);
    }
  });

  //logic to update the server so nag equals true
  //*********************************************
  router.post("/nags/toggletrue", (req, res) => {
    db.query(
      `
      UPDATE nags
      SET completion = true
      WHERE id = $1;
      `,
      [req.body.id]
    ).then(result => {
      res.json(result.data);
    });
  });

  //logic to update the server so nag equals false
  //**********************************************
  router.post("/nags/togglefalse", (req, res) => {
    db.query(
      `
        UPDATE nags
        SET completion = false
        WHERE id = $1;
        `,
      [req.body.id]
    ).then(result => {
      res.json(result.data);
    });
  });
  return router;
};
