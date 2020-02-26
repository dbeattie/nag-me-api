const router = require("express").Router();
const bcrypt = require("bcrypt");

//Function that handles the login flow of the app
//***********************************************

module.exports = db => {
  router.get("/auth", (req, res) => {
    if (req.session.userId) {
      res.json({
        result: true,
        id: req.session.userId
      });
    } else {
      res.json({
        result: false
      });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = { email, password };

    const data = await db.query(`SELECT * FROM users WHERE email = $1`, [
      user.email
    ]);

    if (data.rows.length === 0) {
      res.status(401).json({
        result,
        message: "user not found"
      });
    }

    const result = await bcrypt.compare(user.password, data.rows[0].password);

    if (result) {
      req.session.userId = data.rows[0].id;

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

  return router;
};
