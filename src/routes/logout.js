const router = require("express").Router();

//IF YOU'RE WORKING ON ROUTES USE req/res convention!!!

module.exports = db => {
  router.post('/logout', (req, res) => {
    // console.log("WHAT HAPPEN?-->", req.session.isChanged)
    req.session = null;
    res.json({
      result: true,
      message: "Logged Out"
    });
  });
  return router   
};