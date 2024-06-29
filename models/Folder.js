const mongoose = require("mongoose");

const Folder_Schema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
},
    { timestamps: true })

module.exports = mongoose.model('Folder', Folder_Schema);