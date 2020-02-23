const router = require("express").Router();
const bcrypt = require('bcrypt');

//IF YOU'RE WORKING ON ROUTES USE req/res convention!!!

module.exports = db => {

  router.get('/auth', (req, res) => {
    // console.log("SESSION.USERID", req.session.userId)
    if (req.session.userId) {
      res.json({
        result: true,
        id: req.session.userId
      })
    } else {
      res.json({
        result: false
      })
    }  
  });

  router.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    const user = { email, password };
    
    // console.log('USER:', user)

    const data = await db.query(
      `SELECT * FROM users WHERE email = $1`,
      [user.email]
    );

    if (data.rows.length === 0) {
      res.status(401).json({
            result,
            message: "user not found"
          });
    }

    // console.log('data.rows.length', data.rows.length)
  
    const result = await bcrypt.compare(user.password, data.rows[0].password);
    
    // console.log("REQ SESSION:", req.session.isNew);
    if (result) {
      req.session.userId = data.rows[0].id;
      // console.log("REQ.SESSION.USER_ID:", req.session.userId)
      res.json({
        result,
        message: "logged in",
        id: data.rows[0].id
      });
    } else {
      res.status(401).json({
        result,
        message: "wrong password"
      });
    } 
  });

  return router   
};