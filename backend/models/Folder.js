const mongoose = require("mongoose");

const Folder_Schema = new mongoose.Schema({
    //* Automatically created unique ID
    folder_name: { type: String, required: true }, // Folder name
    subfolders: { type: Array }, // Array of subfolder names
    files: { type: Array }, // Array of file names
},
    { timestamps: true })

module.exports = mongoose.model('Folder', Folder_Schema);