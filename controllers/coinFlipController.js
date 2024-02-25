const CoinFlip = require('../models/CoinFlip');
const mongoose = require('mongoose');
const User = require('../models/User');

class CoinFlipController {
    initializeGame = async(req, res, next) => {
        console.log(req.body);
        try {
            const { username, player1Bet, gameId } = req.body;
            const newGame = new CoinFlip({
                player1: username,
                player1Bet: player1Bet,
                gameId: gameId
            });
            await newGame.save();

            const responseData = {
                player1: username,
                player1Bet: player1Bet,
                gameId: gameId
            };

            res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    joinGame = async (req, res, next) => {
        console.log(req.body);
        try {
            const { username, gameId } = req.body;
    
            const updatedGame = await CoinFlip.findOneAndUpdate(
                { gameId: gameId },
                { player2: username },
                { new: true }
            );
    
            if (!updatedGame) {
                throw new Error("Game not found");
            }
    
            const responseData = {
                gameId: gameId,
                player2: username
            };
    
            res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    };

    placeBet= async(req, res, next) => {
        console.log(req.body)
        try {
            const { gameId, player2Bet } = req.body;
            const updatedGame = await CoinFlip.findOneAndUpdate(
                { gameId: gameId },
                { player2Bet: player2Bet },
                { new: true }
            );
            
            if (!updatedGame) {
                throw new Error("Game not found");
            }
            
            const responseData = {
                gameId: gameId,
                player2Bet: player2Bet
            };
    
            res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    };
    
    playCoinFlip = async(req, res, next) => {
        console.log(req.body)
        try {
            const { gameId } = req.body;
            const game = await CoinFlip.findOne({ gameId: gameId });
    
            if (!game) {
                throw new Error("Game not found");
            }
            const decider = Math.random()
            const result = decider < 0.5 ? game.player1 : game.player2;
            console.log(decider ,result)
    
            game.winner = result;
            game.status = "Game finished";
            await game.save();
    
            const responseData = {
                gameId: game._id,
                winner: result,
                status: game.status
            };

            res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }          
    
}

module.exports = new CoinFlipController();
