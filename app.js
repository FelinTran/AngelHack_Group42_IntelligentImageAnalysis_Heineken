const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const env = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');
const fs = require("fs");
const app = express();
const {initializeHandlebars, compile} = require("./config/handlebars");
env.config();

mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("DB Connection Successfully!"))
    .catch((err) => {
        console.log(err);
    });

// View engine
app.use(cors()); 
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cookieParser());

// import configurations
initializeHandlebars();

const indexRouter = require("./routes/index_router");

app.use('/', indexRouter);

app.get('/testing', function (req, res, next) {
    res.status(200).send(compile('pages/index.hbs', {
        layout: 'index.hbs'
    }))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;