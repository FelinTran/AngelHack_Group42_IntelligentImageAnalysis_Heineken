const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const env = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { isAuthenticated, isAdmin } = require('./middleware/auth');

var app = express();

env.config();

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("DB Connection Successfully!"))
  .catch((err) => {
    console.log(err);
  });

require('./middleware/passport');

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1000 * 60 * 60 * 2}
}))

// Middleware
app.use(cors({
  origin: 'http://localhost:5000', // React app URL
  credentials: true
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(logger('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', isAuthenticated, usersRouter);
app.use('/admin', isAuthenticated, isAdmin, require('./routes/admin'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send("Error");
});

module.exports = app;
