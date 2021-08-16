const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "smoothie website", (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        console.log(decodedToken);
      }
    });
  } else {
    res.redirect("/login");
  }
  next();
};
// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "smoothie website", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
