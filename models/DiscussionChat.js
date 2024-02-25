const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  message: { type: String, required: true },
});
module.exports = mongoose.model("Discussion", discussionSchema);


