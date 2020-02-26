const router = require("express").Router();

//IF YOU'RE WORKING ON ROUTES USE req/res convention!!!

//Function that handles the log out funtionality
//**********************************************
module.exports = db => {
  router.post("/logout", (req, res) => {
    req.session = null;
    res.json({
      result: true,
      message: "Logged Out"
    });
  });
  return router;
};
