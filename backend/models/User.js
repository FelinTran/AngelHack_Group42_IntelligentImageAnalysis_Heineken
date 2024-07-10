const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new mongoose.Schema(
    {
        //* Automatically created unique ID
        Username: { type: String, require: true },
        Email: { type: String, require: true, unique: true },
        Password: { type: String, require: true },
        Admin: { type: Boolean }
    }
).plugin(findOrCreate)

module.exports = mongoose.model("Users", UserSchema);

