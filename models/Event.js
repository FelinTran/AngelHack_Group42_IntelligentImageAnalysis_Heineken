const mongoose = require("mongoose");

const Folder_Schema = new mongoose.Schema({
    event_name: { type: String, unique: true, required: true },
},
    { timestamps: true })

module.exports = mongoose.model('Event', Folder_Schema);