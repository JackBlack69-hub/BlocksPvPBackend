const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/login', userController.userValidation);
router.get('/getUser', userController.getUser);
  

module.exports = router;
