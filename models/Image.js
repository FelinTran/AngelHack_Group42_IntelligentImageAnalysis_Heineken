const mongoose = require("mongoose");

const Image_Analytic_Schema = new mongoose.Schema({
    event_name: { type: String, required: true }, // folder is "root" as default
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    base64: { type: String, required: true }, // content of image
},
    { timestamps: true })

module.exports = mongoose.model('Image', Image_Analytic_Schema);