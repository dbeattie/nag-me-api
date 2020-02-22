const router = require("express").Router();

module.exports = db => {
  router.get("/goals", (request, response) => {
    console.log({ session: request.session })
    if (!request.session.userId) {
      return response.status(401).json({ message: 'Not authorized' });
    }

    db.query(`SELECT id, goal_name, user_id, to_char(start_date,'FMMonth FMDDth, YYYY') as start_date, to_char(end_date,'FMMonth FMDDth, YYYY') as end_date, cron, friend_1_phone_number, friend_2_phone_number FROM goals WHERE user_id = $1 ORDER BY goals.id`, [request.session.userId]).then(({ rows: goals }) => {
      response.json(
        goals.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
  });

  //user_id is hard coded for now...
  router.put("/goals/new", (req, res) => {
    req.connection.setTimeout( 1000 * 60 * 10 );
    // console.log(req.body);
    const queryString = 'INSERT INTO goals(goal_name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [req.body.goal, req.body.user, req.body.startdate, req.body.enddate, 'everyday at 1000', req.body.phone1, req.body.phone2];

    db.query(queryString, values, (err, res) => {
      if(err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);

        //Using Darren's function to parse the timestamp, only keeps year month day
        const getDate = dateTime => {
          dateTimeArray = dateTime.split("T");
          return dateTimeArray[0];
        };
        const startDate = getDate(req.body.startdate);
        const endDate = getDate(req.body.enddate);
        // console.log ("new Date is here: ", startDate, endDate );

        //use dateArray to store the dates to be insert into "nags" table's date column.
        let dateArray = [];
        let actualEndDate = new Date(endDate);
        for (let d = new Date(startDate); d <= actualEndDate; d.setDate(d.getDate() + 1)){
          dateArray.push(getDate(d.toISOString()));
        }
        console.log(dateArray);

        const startNagQuery = `INSERT INTO nags (goal_id, nag_name, completion, date, time)
        VALUES `;
        const endNagQuery = ` ,'1900'), `;
        const finalNagQuery = (startQuery, endQuery, passinDateArray) => {
          let middleNagQuery = ``;
          passinDateArray.forEach(item => {
            middleNagQuery = middleNagQuery + `(${res.rows[0].id}, '${req.body.nag}', false, ` + `'${item}'` + endQuery;
          })
          let returnString = startQuery + middleNagQuery;
          return returnString;
        }
        let actualFinalNagQuery = finalNagQuery(startNagQuery, endNagQuery, dateArray);
        actualFinalNagQuery = actualFinalNagQuery.substr(0, actualFinalNagQuery.length - 2);
        actualFinalNagQuery += `;`;
        console.log(actualFinalNagQuery);
        db.query(actualFinalNagQuery, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log(res.rows[0]);
          }
        })
      }
    })
  })

  router.put("/goals/delete", (req, res) => {
    req.connection.setTimeout( 1000 * 60 * 100 );
    console.log(req.body.id);
    console.log(typeof req.body.id);
    const queryString = 'DELETE FROM goals WHERE id = $1';
    const values = [req.body.id];
    db.query(queryString, values, (err, res) => {
      if(err) {
        console.log(err.stack);
      } else {
        console.log("Deletion completed!");
      }
      // db.end();
    });
    res.send("hello, i am from backend after deletion!");
  })

  return router;
};
