const router = require("express").Router();

module.exports = db => {
  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.json({
      result: true,
      message: "Logged Out"
    });
  });
  return router   
};