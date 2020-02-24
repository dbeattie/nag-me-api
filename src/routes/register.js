const router = require("express").Router();
const bcrypt = require("bcrypt");

//IF YOU'RE WORKING ON ROUTES USE req/res convention!!!

module.exports = db => {
  router.post("/register", async (req, res) => {
    try {
      const { name, email, password, phone_number } = req.body;
      const user = { name, email, password, phone_number };

      // console.log('USER:', user)
      if (user.email === "" || user.password === "" || user.name === "" || user.phone_number === "") {
        res.status(400).json({
          result,
          message: "400 Bad request. Missing name, email, password or phone number."
        });
      }
      
      const hash = await bcrypt.hash(user.password, 10);
      // console.log('HASH:', hash)
      
      const queryString = `INSERT INTO users(user_name, email, password, phone_number) VALUES($1,$2,$3,$4) RETURNING id, user_name, email, phone_number;`

      const data = await db.query(queryString, 
        [user.name, user.email, hash, user.phone_number]);

      const newUser = data.rows[0]
      // console.log("NEWUSER:", newUser);
      req.session.userId = newUser.id
      res.json({ user: newUser });
    
    } catch (error) {
      console.log(error)
    }
  });
  
  return router;
};