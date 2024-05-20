const express = require("express");

const router = express.Router();
const User = require("../models/user");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", (req, res, next) => {
  res.render("sign-up-form");
});

router.post("/sign-up", async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      firstname: req.body.firstname,
      password: req.body.password,
      status: "regular",
    });
    const result = await user.save();
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
