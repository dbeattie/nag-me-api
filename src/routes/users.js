const router = require("express").Router();

module.exports = db => {
  router.get("/users", async (req, res) => {
    
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      
      const userQuery = `SELECT id, user_name, email, phone_number FROM users ORDER BY $1`;
    
      const data = await db.query(userQuery, [req.session.userId]);
      // console.log(data.rows);
      res.json(data.rows);

    } catch(error) {
      console.log(error)
    }
  });

  return router;
};
