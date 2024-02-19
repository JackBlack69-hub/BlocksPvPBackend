const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    level: {
        type: Number,
    }
});

const User = mongoose.model("user",userSchema);
module.exports = User;