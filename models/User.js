const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
    },
    pfp: {
        type: String,
      },
});

const User = mongoose.model("user",userSchema);
module.exports = User;