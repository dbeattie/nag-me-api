const router = require("express").Router();
const bcrypt = require("bcrypt");

module.exports = db => {
  router.post("/register", async function(req, res) {
    const { name, email, password } = req.body;
    const user = { name, email, password };

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
    // req.session.userId = data.rows[0].id


    // .then(data => {
    //   const user = data.rows[0];
    //   if (user) {
    //     response.statusCode = 400;
    //     response.end("400 Bad request. Email already registered");
    //   } else {
    //     db.query(
    //       `INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING *;`,
    //       [request.body.name, request.body.email, hashedPassword]
    //     ).then(data => {
    //       const newUser = data.rows[0];
    //       // eslint-disable-next-line camelcase
    //       request.session.user_id = newUser.id;
    //       response.redirect("/tasks");
    //     });
    //   }
    // });
  });
  return router;
};

//     user.save(function(err) {
//       if (err) {
//         console.log(err);
//         res.status(500).send("Error registering new user please try again.");
//       } else {
//         res.status(200).send("Welcome to the club!");
//       }
//     });
//   });

//   //POST register
//   router.post("/", (request, response) => {
//     const email = request.body.email;
//     const password = request.body.password;
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(password, salt);

//     if (email === "" || password === "") {
//       response.statusCode = 400;
//       response.end("400 Bad request. Missing email or password");
//       return;
//     }
//     db.query(
//       `SELECT email
//     FROM users
//     WHERE email = $1;`,
//       [request.body.email]
//     ).then(data => {
//       const user = data.rows[0];
//       if (user) {
//         response.statusCode = 400;
//         response.end("400 Bad request. Email already registered");
//       } else {
//         db.query(
//           `INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING *;`,
//           [request.body.name, request.body.email, hashedPassword]
//         ).then(data => {
//           const newUser = data.rows[0];
//           // eslint-disable-next-line camelcase
//           request.session.user_id = newUser.id;
//           response.redirect("/tasks");
//         });
//       }
//     });
//   });

// router.post("/nags", (request, response) => {
//   db.query(
//     `
//     SELECT * FROM nags ORDER BY nags.id
//     `
//   ).then(({ rows: nags }) => {
//     response.json(nags);
//   });
// });

// load login/register page
//  router.get('/', (request, response) => {
//     // check if user is logged in
//     if (request.session.user_id) {
//       response.redirect('/tasks');

//     } else {
//       let templateVars = {
//         user: { id: undefined, name: null }
//       };
//       response.render('../views/register', templateVars);
//     }
//   });

// router.post('/signup', (req, res) => {
//     console.log(req.body);
//     const table = req.body.jobber ? "jobbers" : "users";
//     bcrypt.hash(req.body.password, 10)
//       .then((hash) => {
//         const queryString = `
//         INSERT INTO ${table}(name, password, email, phone)
//         VALUES ($1, $2, $3, $4)
//       `;
//         const values = [req.body.name, hash, req.body.email, req.body.phone];
//         pool.query(queryString, values, (error, results) => {
//           if (error) {
//             res.json({
//               result: false
//             });
//             throw error
//           }
//           res.json({
//             result: true,
//             message: "user created"
//           });
//           //response.status(200).json(results.rows)
//         });
//       });
//   });
