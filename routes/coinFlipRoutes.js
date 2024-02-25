const express = require('express');
const router = express.Router();
const CoinFlipController = require('../controllers/coinFlipController');

router.post('/initialize', CoinFlipController.initializeGame);
router.post('/join', CoinFlipController.joinGame);
router.post('/placeBet', CoinFlipController.placeBet);
router.post('/playCoinFlip', CoinFlipController.playCoinFlip);

module.exports = router;
