const router = require('express').Router();
const passport = require('passport');
const { isAuthenticated } = require("../middleware/auth")
const { compile } = require("../config/handlebars");
const multer = require('multer');
const Image = require("../models/Image");
const Analyze = require("../models/Analyze");
const Folder = require("../models/Folder");

require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20971520 } }).array('files');

router.get("/", function (req, res, next) {
    res.redirect("/login");
})

router.get('/login', function (req, res, next) {
    res.status(200).send(compile('pages/login.hbs', {
        title: 'Payslip', layout: 'login.hbs'
    }))
})

router.post('/auth', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        req.logIn(user, (err) => {
            if (err) return next(err);
            if (user.Admin) res.redirect('/admin'); else res.redirect('/payslip/' + user.Emp_Code)
        });
    })(req, res, next);
});

router.post('/upload/image', async (req, res, next) => {
    upload(req, res, (err) => {
        try {
            
            const files = req.files['image'];
            const folder = req.folder || "root";

            files.map(file => {
                const { originalname, mimetype, buffer } = file;
                // Convert image buffer to base64
                const base64 = buffer.toString('base64');

                // Create a new image document
                const image = new Image({
                    folder: folder,
                    filename: originalname,
                    contentType: mimetype,
                    base64: base64
                });

                image.save();
            })
        } catch (err) {
            next(err);
        }
        res.status(200).json({ message: 'Files uploaded successfully' });
    });
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        req.session.destroy();
        if (err) return next(err);
        res.redirect('/login');
    });
});

module.exports = router;