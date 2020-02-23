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

  //user_id is hard coded for now...
  router.put("/goals/new", (req, res) => {
    req.connection.setTimeout( 1000 * 60 * 10 );
    // console.log(req.body);
    const queryString = 'INSERT INTO goals(goal_name, user_id, start_date, end_date, cron, friend_1_phone_number, friend_2_phone_number) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [req.body.goal, 1, req.body.startdate, req.body.enddate, 'everyday at 1000', req.body.phone1, req.body.phone2];

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
    res.send("hello, i am from backend after adding new goal!");
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

  router.put("/goals/edit", (req, res) => {
    req.connection.setTimeout( 1000 * 60 * 100 );
    console.log("I am body for edit:", req.body);
    const queryString = "UPDATE goals SET goal_name = $1, start_date = $2, end_date = $3, friend_1_phone_number = $4, friend_2_phone_number = $5 WHERE id = $6 RETURNING *";
    const values = [req.body.goal, req.body.startdate, req.body.enddate, req.body.phone1, req.body.phone2, req.body.goalid];
    
    db.query(queryString, values, (err, res) => {
      if(err) {
        console.log(err.stack);
      } else {
        console.log(res.rows);

        //Using Darren's function to parse the timestamp, only keeps year month day
        const getDate = dateTime => {
          dateTimeArray = dateTime.split("T");
          return dateTimeArray[0];
        };
        const startDate = getDate(req.body.startdate);
        const endDate = getDate(req.body.enddate);
        console.log ("new Date is here: ", startDate, endDate );

        let dateArray = [];
        let actualEndDate = new Date(endDate);
        for (let d = new Date(startDate); d <= actualEndDate; d.setDate(d.getDate() + 1)){
          dateArray.push(getDate(d.toISOString()));
        }
        console.log(dateArray);

        db.query(`DELETE FROM nags WHERE goal_id = ${req.body.goalid}`, (err, res) => {
          if(err) {
            console.log(err.stack);
          } else {
            console.log("Goal's nags deletion completed!");
            console.log("Now start to insert updated nags!");

            const startNagUpdateQuery = `INSERT INTO nags (goal_id, nag_name, completion, date, time) VALUES `;
            const endNagUpdateQuery = ` ,'1900'), `;
            const finalNagUpdateQuery = (startQuery, endQuery, passinDateArray) => {
              let middleNagUpdateQuery = ``;
              passinDateArray.forEach(item => {
                middleNagUpdateQuery = middleNagUpdateQuery + `(${req.body.goalid}, '${req.body.nag}', false, ` + `'${item}'` + endQuery;
              })
              let returnString = startQuery + middleNagUpdateQuery;
              return returnString;
            }
            let actualFinalNagUpdateQuery = finalNagUpdateQuery(startNagUpdateQuery, endNagUpdateQuery, dateArray);
            actualFinalNagUpdateQuery = actualFinalNagUpdateQuery.substr(0, actualFinalNagUpdateQuery.length - 2);
            actualFinalNagUpdateQuery += `;`;
            console.log(actualFinalNagUpdateQuery);

            db.query(actualFinalNagUpdateQuery, (err, res) => {
              if (err) {
                console.log(err.stack);
              } else {
                console.log(res.rows);
              }
            });
          }
        })
      }
    });
    res.send("hello, i am from backend after edit!");
  })

  return router;
};
