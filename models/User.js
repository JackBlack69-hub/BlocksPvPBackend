const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
    path: String,
    assetDetails: {
        assetId: String,
        inventoryItemAssetType: String,
        instanceId: String
    }
});

const userSchema = new mongoose.Schema({
    userId:{
        type: Number,
        required: true
    },
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
    inventory: [inventoryItemSchema] // Define the inventory attribute as an array of inventoryItemSchema
});

const User = mongoose.model("User", userSchema);
module.exports = User;
