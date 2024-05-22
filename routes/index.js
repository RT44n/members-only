const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const router = express.Router();
const User = require("../models/user");
const Message = require("../models/message");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const messages = await Message.find().populate("author");
    res.render("index", { user: req.user, messages });
  } catch (err) {
    next(err);
  }
});
router.get("/sign-up", (req, res, next) => {
  res.render("sign-up-form");
});

router.get("/message-form", (req, res, next) => {
  res.render("message-form", { user: req.user });
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
    const user = new User({
      username: req.body.username,
      firstname: req.body.firstname,
      password: hashedPassword,
      status: "regular",
    });
    const result = await user.save();
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

router.post("/message-form", async (req, res, next) => {
  try {
    const message = new Message({
      author: req.user,
      date: new Date(),
      title: req.body.title,
      message: req.body.message,
    });

    const result = await message.save();
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
module.exports = router;
