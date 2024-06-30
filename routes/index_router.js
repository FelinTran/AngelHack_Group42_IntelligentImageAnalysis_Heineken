const router = require('express').Router();
const { compile } = require("../config/handlebars");
const multer = require('multer');
const Analyze = require("../models/Analyze");
const path = require('path');
const {convert} = require("../utils");

require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20971520 } }).array('files');

// Create the "files" directory if it doesn't exist
const fs = require('fs');

const dir = './public/images/files';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const cachedir = "./cache";
if (!fs.existsSync(cachedir)) {
    fs.mkdirSync(cachedir);
}


router.get("/", async function (req, res, next) {
    res.redirect('/index');
})

router.get("/index", async function (req, res, next) {
    let analyze_data = await Analyze.find();
    let filenames = [];
    for (let i in analyze_data)
        {
            filenames.push(analyze_data[i].filename)
        }
    res.status(200).send(compile('pages/home.hbs', {
        title: 'Home', layout: 'index.hbs', data: filenames
    }))
})

// router.get("/info-page", async function (req, res, next) {

//     res.status(200).send(compile('pages/info-page.hbs', {
//         title: 'Business Problem', layout: 'index.hbs'
//     }))
// })

router.get("/key_elements", async function (req, res, next) {
    let filename = req.query.filename;
    let analyze_data = await Analyze.findOne({filename: filename})
    res.status(200).send(compile('pages/key_elements.hbs', {
        title: 'Key Elements', layout: 'index.hbs', data: convert(analyze_data.analyze_data), filename: filename
    }))
})

router.get("/count_beer_drinkers", async function (req, res, next) {
    let filename = req.query.filename;
    let analyze_data = await Analyze.findOne({filename: filename});
    console.log(analyze_data)
    if (!analyze_data) res.status(404).send("Data not found!")
    res.status(200).send(compile('pages/count_beer_drinkers.hbs', {
        title: 'Count Beer Drinkers', layout: 'index.hbs', data: convert(analyze_data.analyze_data), filename: filename
    }))
})

router.get("/detect_emotions", async function (req, res, next) {
    let filename = req.query.filename;
    let analyze_data = await Analyze.findOne({filename: filename})
    res.status(200).send(compile('pages/detect_emotions.hbs', {
        title: 'Detect Emotions', layout: 'index.hbs', data: convert(analyze_data.analyze_data), filename: filename
    }))
})

router.get("/track_staff", async function (req, res, next) {
    let filename = req.query.filename;
    let analyze_data = await Analyze.findOne({filename: filename})
    res.status(200).send(compile('pages/track_staff.hbs', {
        title: 'Track Staff', layout: 'index.hbs', data: convert(analyze_data.analyze_data), filename: filename
    }))
})

router.get("/grade_store_presence", async function (req, res, next) {
    let filename = req.query.filename;
    let analyze_data = await Analyze.findOne({filename: filename})
    res.status(200).send(compile('pages/grade_store_presence.hbs', {
        title: 'Grade Store Presence', layout: 'index.hbs', data: convert(analyze_data.analyze_data), filename: filename
    }))
})

router.get("/detect_posm", async function (req, res, next) {
    let filename = req.query.filename;
    let analyze_data = await Analyze.findOne({filename: filename})
    res.status(200).send(compile('pages/detect_posm.hbs', {
        title: 'Detect POSM', layout: 'index.hbs', data: convert(analyze_data.analyze_data), filename: filename
    }))
})


router.post('/upload/image', async (req, res, next) => {
    var filePaths = [];
    upload(req, res, (err) => {
        try {
            const files = req.files;

            files.map(file => {
                const filePath = path.join(__dirname, '../public/images/files', Date.now() + '_' + file.originalname);
                const cachePath = path.join(__dirname, '../cache', Date.now() + '_' + file.originalname);
                // Write the file to the local filesystem
                try {
                    fs.writeFileSync(filePath, file.buffer);
                    fs.writeFileSync(cachePath, file.buffer);
                    filePaths.push(path.join('/images/files', Date.now() + '_' + file.originalname));
                } catch (err) {
                    return next(err);
                }

            })
        } catch (err) {
            next(err);
        }
    });

    console.log(filePaths)
    let data = await fetch(' http://localhost:3000/', {
        method: 'GET',
        mode: 'no-cors',
    }).then(async (data) => {
        let data_ = await data.json();
        console.log(filePaths[0])
        const newAnalyze = new Analyze({
            filename: filePaths[0],
            analyze_data: data_
        })
        newAnalyze.save();
        return data_;
    })

    console.log(data);
    res.status(200).json({ message: 'Files uploaded successfully', filePath: filePaths[0], data: data });

})


module.exports = router;