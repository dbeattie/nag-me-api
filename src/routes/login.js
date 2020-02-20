const router = require("express").Router();
const bcrypt = require('bcrypt');

module.exports = db => {

  router.post("/login", async function(req, res) {
    
    const { email, password } = req.body;
    const user = { email, password };
    
    console.log('USER:', user)

    const data = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [user.email]
    );

    if (data.rows.length === 0) {
      res.json({
            result: false,
            message: "user not found"
          });
    }

    console.log('data.rows.length', data.rows.length)
  
    const result = await bcrypt.compare(user.password, data.rows[0].password)
    
    console.log("REQ SESSION:", req.session.isNew);
    if (result) {
      req.session.userId = data.rows[0].id;
      console.log("REQ.SESSION.USER_ID:", req.session.userId)
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
    // req.session.userId = userID
    // res.cookie("token", token, { httpOnly: true }).sendStatus(200);
  });

  return router   
};

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