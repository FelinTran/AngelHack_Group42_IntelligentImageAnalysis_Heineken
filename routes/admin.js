const router = require('express').Router();
const Payslip = require("../models/Payslip");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { isAdmin } = require("../middleware/auth");
const { keyMap, changeKeys, fixData, isValidData } = require("../utils/utils");
const multer = require('multer');
const XLSX = require('xlsx');
const { compile } = require("../config/handlebars");

require("dotenv").config();



router.get("/", isAdmin, function (req, res, next) {
    res.status(200).send(compile('pages/admin.hbs', {
        layout: 'admin.hbs'
    }))
});



router.post('/register', async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ Emp_Code: req.body.Emp_Code });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log(req.body)
        const NewUser = new User({
            Emp_Code: req.body.Emp_Code,
            Email: req.body.Email,
            Password: bcrypt.hashSync(req.body.Password, parseInt(process.env.SALT)),
            Admin: req.body.Admin || false
        });

        const savedUser = await NewUser.save();
        res.status(200).send("Registered successfully!");
    } catch (err) {
        next(err);
    }
});


module.exports = router;