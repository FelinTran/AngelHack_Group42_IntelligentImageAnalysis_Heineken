const mongoose = require("mongoose");

const Analyze_Schema = new mongoose.Schema({
    //* Automatically created unique ID
    filename: { type: String, required: true },
    analyze: {
        logo: { type: Object },
        product: { type: Object },
        human: { type: Object },
        posm: { type: Object },
        context: { type: Object },
    }
},
    { timestamps: true })

module.exports = mongoose.model('Analyze', Analyze_Schema);