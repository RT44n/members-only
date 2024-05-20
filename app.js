const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

require("dotenv").config();

// MongoDB connection string
const mongoDb = process.env.MONGO_DATABASE;
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();
app.set("views", path.join(__dirname, "views")); // Ensure views directory is correctly set
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize()); // Add passport.initialize()
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);

app.listen(3000, () => console.log("App listening on port 3000!"));

module.exports = app;
