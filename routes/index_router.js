const router = require('express').Router();
const { compile } = require("../config/handlebars");
const multer = require('multer');
const Analyze = require("../models/Analyze");
const path = require('path');

require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20971520 } }).array('files');


// Create the "files" directory if it doesn't exist
const fs = require('fs');

const dir = './files';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const cachedir = "./cache";
if (!fs.existsSync(cachedir)) {
    fs.mkdirSync(cachedir);
}


router.get("/", function (req, res, next) {
    res.status(200).send(compile('pages/home.hbs', {
        title: 'Home', layout: 'index.hbs'
    }))
})

router.get("/index", function (req, res, next) {
    res.status(200).send(compile('pages/home.hbs', {
        title: 'Home', layout: 'index.hbs'
    }))
})

router.get("/info-page", function (req, res, next) {


    res.status(200).send(compile('pages/info-page.hbs', {
        title: 'Business Problem', layout: 'index.hbs'
    }))
})

router.get("/key-elements", function (req, res, next) {
    res.status(200).send(compile('pages/key_elements.hbs', {
        title: 'Key Elements', layout: 'index.hbs'
    }))
})

router.get("/count-beer-drinkers", function (req, res, next) {
    res.status(200).send(compile('pages/count_beer_drinkers.hbs', {
        title: 'Count Beer Drinkers', layout: 'index.hbs'
    }))
})

router.post('/upload/image', async (req, res, next) => {
    var filePaths = [];
    upload(req, res, (err) => {
        try {
            const files = req.files;

            files.map(file => {
                const filePath = path.join(__dirname, '../files', Date.now() + '_' + file.originalname);
                const cachePath = path.join(__dirname, '../cache', Date.now() + '_' + file.originalname);
                // Write the file to the local filesystem
                try {
                    fs.writeFileSync(filePath, file.buffer);
                    fs.writeFileSync(cachePath, file.buffer);
                    filePaths.push(filePath);
                } catch (err) {
                    return next(err);
                }

            })
        } catch (err) {
            next(err);
        }
    });

    res.status(200).json({ message: 'Files uploaded successfully', filePaths: filePaths });

    await fetch(' http://localhost:3000/', {
        method: 'GET',
        mode: 'no-cors',
    }).then(data => {
        let data_ = data.json();
        const newAnalyze = new Analyze({
            filename: data_.filename,
            analyze_data: data_.analyze_data
        })

        newAnalyze.save();
    })

})



module.exports = router;