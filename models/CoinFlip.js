const mongoose = require("mongoose");

const coinFlipSchema = new mongoose.Schema({
    player1: {
        type: String,
        ref: 'User',
        // required: true
    },
    player2: {
        type: String,
        ref: 'User',
        // required: true
    },
    gameId: {
        type: Number,
        // required: true
    },
    player1Bet: {
        type: mongoose.Schema.Types.Mixed,
        // required: true
    },
    player2Bet:{
        type: mongoose.Schema.Types.Mixed,
    }
});

const CoinFlip = mongoose.model("CoinFlip", coinFlipSchema);
module.exports = CoinFlip;
