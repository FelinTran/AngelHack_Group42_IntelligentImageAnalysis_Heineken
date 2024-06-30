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
    res.status(200).send(compile('pages/info_page.hbs', {
        layout: 'index.hbs'
    }))
})

app.get('/testing/upload', function (req, res, next) {
    res.status(200).send(compile('pages/admin.hbs', {
        layout: 'admin.hbs'
    }))
})
app.get("/key_elements", function (req, res, next) {
    res.status(200).send(compile('pages/key_elements.hbs', {
        title: 'Key Elements', layout: 'index.hbs'
    }))
})

app.get("/count_beer_drinkers", function (req, res, next) {
    res.status(200).send(compile('pages/count_beer_drinkers.hbs', {
        title: 'Count Beer Drinkers', layout: 'index.hbs'
    }))
})

app.get("/detect_emotions", function (req, res, next) {
    res.status(200).send(compile('pages/detect_emotions.hbs', {
        title: 'Detect Emotions', layout: 'index.hbs'
    }))
})

app.get("/track_staff", function (req, res, next) {
    res.status(200).send(compile('pages/track_staff.hbs', {
        title: 'Track Staff', layout: 'index.hbs'
    }))
})

app.get("/grade_store_presence", function (req, res, next) {
    res.status(200).send(compile('pages/grade_store_presence.hbs', {
        title: 'Grade Store Presence', layout: 'index.hbs'
    }))
})

app.get("/detect_posm", function (req, res, next) {
    res.status(200).send(compile('pages/detect_posm.hbs', {
        title: 'Detect POSM', layout: 'index.hbs'
    }))
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;