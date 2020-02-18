const router = require("express").Router();
const bcrypt = require('bcrypt');

module.exports = db => {

    router.post("/authenticate", function(req, res) {
        const { email, password } = req.body;
        const user = { email: "larrys@example.com", password: "1234" };
        // if (err) {
        //   console.error(err);
        //   res.status(500).json({
        //     error: "Internal error please try again"
        //   });
      
        // if (!user) {
        //   res.status(401).json({
        //     error: "Incorrect email or password"
        //   });
        // } else {
        //   user.isCorrectPassword(password, function(err, same) {
        //     if (err) {
        //       res.status(500).json({
        //         error: "Internal error please try again"
        //       });
        //     } else if (!same) {
        //       res.status(401).json({
        //         error: "Incorrect email or password"
        //       });
        //     } else {
        //       // Issue token
        req.session.user_id = userID
        res.cookie("token", token, { httpOnly: true }).sendStatus(200);
      });

return router   
  };

  

   // router.post("/login", (request, response) => {
    //   db.query(
    //     `
    //     SELECT * FROM nags ORDER BY nags.id
    //     `
    //   ).then(({ rows: nags }) => {
    //     response.json(nags);
    //   });
    // });
  
    // return router;



    // //POST login
    // router.post('/login', (request, response) => {
    //     // check if user exists in database
    //     db.query(`SELECT id, email, password
    //   FROM users
    //   WHERE email = $1;`, [request.body.email])
    //       .then(data => {
    //         const user = data.rows[0];
    //         if (!user) {
    //           response.statusCode = 403;
    //           response.end('403 Forbidden. E-mail cannot be found');
    //         } else if (!bcrypt.compareSync(request.body.password, user.password)) {
    //           response.statusCode = 403;
    //           response.end('403 Forbidden. Wrong password');
    //         } else {
    //           // eslint-disable-next-line camelcase
    //           request.session.user_id = user.id;
    //           response.redirect('/tasks');
    //         }
    //       })
    //       .catch(err => {
    //         // render login with error
    //         response
    //           .status(500)
    //           .json({ error: err.message });
    //       });
    //   });