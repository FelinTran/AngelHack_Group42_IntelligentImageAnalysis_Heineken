const mongoose = require("mongoose");

const Analyze_Schema = new mongoose.Schema({
    event_name: {type: String, required: true},
    image_filename: { type: String, required: true },
    analyze_data: {
        logo: { type: Object },
        product: { type: Object },
        human: { type: Object },
        posm: { type: Object },
        context: { type: Object },
    }
},
    { timestamps: true })

module.exports = mongoose.model('Analyze', Analyze_Schema);