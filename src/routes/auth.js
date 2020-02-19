const express = require('express');
const router = express.Router();
// const db = require('./db');
const bcrypt = require('bcrypt');
let userId;

router.get('/', (req, res) => {
  if (req.session.userId) {
    res.json({
      result: "user"
    })
  } else {
    res.json({
      result: "none"
    })
  }  
});

// router.put('/', (req, res) => {
//   const queryString = `
//     UPDATE jobbers SET lat=$1, long=$2
//     WHERE email=$3; `;
//   values = [req.body[0], req.body[1], req.body[2]]
//   pool.query(queryString, values, (err, results) => {
//     if (err) {
//       throw err
//     } else {
//       res.json({
//         result: true,
//         message: "updated coords"
//       })
//     }
//   })
//   console.log('updated coords')
// })

router.post("/authenticate", function(req, res) {
  const { email, password } = req.body;
  const user = { email, password };

  const queryString = `SELECT * FROM users WHERE email = $1`;

  db.query(queryString, user.email, (err, res) => {
    if (err) {
      throw err
    }
    if (results.rows.length > 0) {
      bcrypt.compare(req.body.password, results.rows[0].password)
      .then((result) => {
        if (result) {
          req.session.userId = results.rows[0].id;
          res.json({
            result,
            message: "logged in"
          });
        } else {
          res.json({
            result,
            message: "wrong pw"
          });
        }        
      })
    } else {
      res.json({
        result: false,
        message: "user not found"
      });
    }
  });
});

// router.post('/login', (req, res) => {
//   const table = req.body.jobber ? "jobbers" : "users";
//   const queryString = `SELECT * FROM ${table} WHERE email = $1`;
//   const values = [req.body.email];
//   pool.query(queryString, values, (err, results) => {
//     if (err) {
//       throw err
//     }
//     if (results.rows.length > 0) {
//       bcrypt.compare(req.body.password, results.rows[0].password)
//       .then((result) => {
//         if (result) {
//           if (req.body.jobber) req.session.jobberId = results.rows[0].id;
//           else req.session.userId = results.rows[0].id;
//           res.json({
//             result,
//             message: "logged in"
//           });
//         } else {
//           res.json({
//             result,
//             message: "wrong pw"
//           });
//         }        
//       })
//     } else {
//       res.json({
//         result: false,
//         message: "user not found"
//       });
//     }

//     //response.status(200).json(results.rows)
//   })
// });

router.post("/register", async function(req, res) {
  const { name, email, password } = req.body;
  const user = { name, email, password };
  console.log(user);

  if (user.email === "" || user.password === "" || user.name === "") {
    response.statusCode = 400;
    response.end("400 Bad request. Missing name, email or password");
    return;
  }
  const hash = await bcrypt.hash(user.password, 10);
  
  const data = await db.query(
    `INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING *;`,
    [user.name, user.email, hash]
  );

  req.session.userId = data.rows[0].id
});

router.post('/logout', (req, res) => {
  req.session.userId = undefined;
  res.json({
    result: true,
    message: "Logged Out"
  });
});

module.exports = router;