var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function (req, res) {
  res.render("landing");
});

// show register form
router.get("/register", function (req, res) {
  res.render("register");
});

// handle register/sign up logic
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  if (req.body.adminCode === process.env.ADMIN_CODE) {
    newUser.isAdmin = true;
    console.log("adminCode: " + "encrypted and entered correctly");
  }
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to roamHangout " + user.username);
      res.redirect("/topics");
    });
  });
});

// show login form
router.get("/login", function (req, res) {
  res.render("login");
});

// handle login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/topics",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "welcome back",
  }),
  function (req, res) {}
);

// logout route
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged You Out");
  res.redirect("/topics");
});

module.exports = router;
