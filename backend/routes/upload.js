const router = require('express').Router();
const { compile } = require("../config/handlebars");
const multer = require('multer');
const Analyze = require("../models/Analyze");
const Image = require("../models/Image");

require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20971520 } }).array('files');

router.post('/image', async (req, res, next) => {
    upload(req, res, async (err) => {
        try {
            const files = req.files;

            files.map(async (file) => {
                let img = file.buffer.toString('base64');
                let ext = file.originalname.split('.')[1];
                let filename = file.originalname.split('.')[0];

                let data = {
                    filename: img,
                    contentType: ext,
                    base64: filename
                }

                await Image.create(data);

            })
        } catch (err) {
            next(err);
        }
    });

    await fetch("http://localhost:5000/analyze", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: req.files })
    })
        .then(response => response.json())
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            next(err);
        })

})

module.exports = router;