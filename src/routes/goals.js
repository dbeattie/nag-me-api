const router = require("express").Router();

//IF YOU'RE WORKING ON ROUTES USE req/res convention!!!

//Helper parses the timestamp, only keeps year month day for insertion
const getDate = dateTime => {
  dateTimeArray = dateTime.split("T");
  return dateTimeArray[0];
};

module.exports = db => {
  router.get("/goals", async (req, res) => {
    try {
      // console.log({ session: req.session })
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      db.query(`SELECT id, goal_name, user_id, start_date, to_char(start_date,'FMMonth FMDDth, YYYY') as simple_start_date, end_date, to_char(end_date,'FMMonth FMDDth, YYYY') as simple_end_date, cron, friend_1_phone_number, friend_2_phone_number FROM goals WHERE user_id = $1 ORDER BY goals.id`, [req.session.userId]).then(({ rows: goals }) => {
        res.json(
          goals.reduce(
            (previous, current) => ({ ...previous, [current.id]: current }),
            {}
          )
        );
      });
    } catch (error) {
      console.log(error)
    }
  });

  //async function(req, res)???

  router.put("/goals/new", async (req, res) => {
    try {
      // This timeout was added before switching to async/await, not sure they are needed anymore?  
      // req.connection.setTimeout( 1000 * 60 * 10 );
      // console.log("Session REQUIRED?",{ session: req.session })
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const { goal, startdate, enddate, phone1, phone2, nag } = req.body;
      const newGoal = { goal, startdate, enddate, phone1, phone2, nag };

      // console.log("NEWGOAL:", newGoal)
      
      const goalQueryStr = 'INSERT INTO goals(goal_name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      
      //Cron insert is a placeholder for now
      const values = [newGoal.goal, req.session.userId, newGoal.startdate, newGoal.enddate, 'everyday at 1000', newGoal.phone1, newGoal.phone2];

      //Puts goal data into database
      const goalQuery = await db.query(goalQueryStr, values);
      console.log("Goal Inserted!", goalQuery.rows[0].id)

      //Creates an array of nag dates from today until the completion date given
      const getDateArr = () => {
        let nagDateArr = [];
        const trimmedStartDate = getDate(newGoal.startdate);
        const trimmedEndDate = getDate(newGoal.enddate);
        const actualEndDate = new Date(trimmedEndDate);
        
        for (let nagDate = new Date(trimmedStartDate); nagDate <= actualEndDate; nagDate.setDate(nagDate.getDate() + 1)) {
          nagDateArr.push(getDate(nagDate.toISOString()));
        }
        return nagDateArr;
      }
      
      const dateQueryArr = getDateArr()
      
      //Crafts the complete SQL insert logic for the nags table
      const nagQuery = (arr) => {
        const startNagQuery = `
          INSERT INTO nags (goal_id, nag_name, completion, date, time)
          VALUES 
          `;
        let valuesQuery = ``;
        const endValues = ` ,'1900'),`;
        
        arr.forEach(item => {
          valuesQuery = valuesQuery + `(${goalQuery.rows[0].id}, '${newGoal.nag}', null, ` + `'${item}'` + endValues;
        });
        let returnString = startNagQuery + valuesQuery;
        return returnString.slice(0, -1) + `;`;
      }

      const finalNagQuery = nagQuery(dateQueryArr);
      
      //Puts nag data into database based
      const nagsQuery = await db.query(finalNagQuery);
      console.log("Nags Inserted!")
      
      res.status(200).json({
        goalQuery,
        nagsQuery,
        message: "Goals and Nags Inserted!"
      });
    } catch (error) {
      console.log(error)
    }
  })

  router.put("/goals/delete", async (req, res) => {
    try {
      // This timeout was added before switching to async/await, not sure they are needed anymore?
      // req.connection.setTimeout( 1000 * 60 * 100 );
      // console.log('REQUIRED BODY:', req.body.id);
    
      const queryString = 'DELETE FROM goals WHERE id = $1';
      const values = [req.body.id];
      
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authorized!' });
      }

      //If user logged in correctly can delete
      const deleteGoal = await db.query(queryString, values)
      console.log("Goals and Nags Deleted!");
      res.status(200).json({
        deleteGoal,
        message: "I'm the backend, confirming goal/nag deletion!"
      });
    } catch (error) {
      console.log(error)
    }
  });

  router.put("/goals/edit", async (req, res) => {
    req.connection.setTimeout( 1000 * 60 * 100 );

    // console.log("I am the req.body:", req.body);

    const updateGoalQueryStr = "UPDATE goals SET goal_name = $1, start_date = $2, end_date = $3, friend_1_phone_number = $4, friend_2_phone_number = $5 WHERE id = $6 RETURNING *";
    const newGoalvalues = [req.body.goal, req.body.startDate, req.body.endDate, req.body.phone1, req.body.phone2, req.body.goalId];
  
    const updateGoalQuery = await db.query(updateGoalQueryStr, newGoalvalues);
    console.log("Goal updated in the DB!");

    // console.log("I am the updateGoal Object:", updateGoalQuery.rows);

    const beginningDate = getDate(req.body.startDate);
    const completionDate = getDate(req.body.endDate);

    // console.log("new Date info is here: ", beginningDate, completionDate);

    let dateArray = [];
    let actualEndDate = new Date(completionDate);
    for (let d = new Date(beginningDate); d <= actualEndDate; d.setDate(d.getDate() + 1)){
      dateArray.push(getDate(d.toISOString()));
    }
    // console.log(dateArray);

    const deleteNagsQuery = db.query(`DELETE FROM nags WHERE goal_id = ${req.body.goalId}`);
    console.log("Old Nags Deleted!")

    const startNagUpdateQuery = `INSERT INTO nags (goal_id, nag_name, completion, date, time) VALUES `;
    const endNagUpdateQuery = ` ,'1900'), `;
    
    const finalNagUpdateQuery = (startQuery, endQuery, passinDateArray) => {
      let middleNagUpdateQuery = ``;
      passinDateArray.forEach(item => {
        middleNagUpdateQuery = middleNagUpdateQuery + `(${req.body.goalId}, '${req.body.nag}', null, ` + `'${item}'` + endQuery;
      })
      let returnString = startQuery + middleNagUpdateQuery;
      return returnString;
    }
   
    let actualFinalNagUpdateQuery = finalNagUpdateQuery(startNagUpdateQuery, endNagUpdateQuery, dateArray);
    actualFinalNagUpdateQuery = actualFinalNagUpdateQuery.substr(0, actualFinalNagUpdateQuery.length - 2);
    actualFinalNagUpdateQuery += `;`;
    // console.log(actualFinalNagUpdateQuery);

    const nagsUpdateQuery = await db.query(actualFinalNagUpdateQuery);
    console.log("New Nags Updated!")
    res.send("hello, i am from backend after edit!");
  })

  return router;
};

