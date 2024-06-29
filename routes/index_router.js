const router = require('express').Router();
const { compile } = require("../config/handlebars");
const multer = require('multer');
const Analyze = require("../models/Analyze");
const Event = require("../models/Event");
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

router.post('/upload/image', async (req, res, next) => {
    upload(req, res, (err) => {
        try {
            const files = req.files;

            console.log(files);

            files.map(file => {
                const filePath = path.join(__dirname, '../files', Date.now() + '_' + file.originalname);
                const cachePath = path.join(__dirname, '../cache', Date.now() + '_' + file.originalname);

                // Write the file to the local filesystem
                try {
                    fs.writeFileSync(filePath, file.buffer);
                    fs.writeFileSync(cachePath, file.buffer);
                } catch (err) {
                    return next(err);
                }

            })
        } catch (err) {
            next(err);
        }
    });

    await fetch(' http://localhost:3000/', {
        method: 'GET',
        mode: 'no-cors',
    }).then(async (response) => {
        let resp = await response.json()
        console.log(resp)
    })

    res.status(200).json({ message: 'Files uploaded successfully' });

})

// router.post('/upload/image', async (req, res, next) => {
//     upload(req, res, (err) => {
//         try {
//             const files = req.files;
//             console.log(files);

//             files.forEach(file => {
//                 // Define the file path
//                 const filePath = path.join(__dirname, 'files', Date.now() + '_' + file.originalname);

//                 // Write the file to the local filesystem
//                 fs.writeFileSync(filePath, file.buffer, (err) => {
//                     if (err) {
//                         return next(err);
//                     }
//                 });
//             })

//         } catch (err) {
//             next(err);
//         }
//     });

//     // await fetch('http://yenthenas.ddns.net:5000/', {
//     //     method: 'POST',
//     //     mode: 'no-cors',
//     // }).then(async (response) => {
//     //     let resp = await response.json()
//     //     console.log(resp)
//     // })

//     res.status(200).json({ message: 'Files uploaded successfully' });
// })

module.exports = router;