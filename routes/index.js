const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { body, validationResult } = require("express-validator");

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

router.post(
  "/sign-up",
  // Validation and sanitization middleware
  [
    body("username")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Username is required"),
    body("firstname")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are validation errors, render form again with sanitized values/error messages
      return res.render("sign-up-form", {
        errors: errors.array(),
        user: req.body,
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
      const user = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        password: hashedPassword,
      });
      if (req.body.secret === process.env.SECRET) {
        user.status = "admin";
      } else user.status = "regular";

      const result = await user.save();
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }
);

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

router.post("/delete-message", async (req, res, next) => {
  const { messageId } = req.body;
  const { user } = req;

  if (user && user.status === "admin") {
    try {
      await Message.findByIdAndDelete(messageId);
      res.redirect("/");
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(403).send("Forbidden");
  }
});

module.exports = router;
