const axios = require('axios');
const User = require('../models/User')
const jwt = require('jsonwebtoken');

class UserController {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://users.roblox.com/v1';
  }

  async fetchUserDetails(username) {
    try {
      const userId = await this.fetchUserId(username);
      const response = await axios.get(
        `${this.baseUrl}/users/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return response.data.description;
    } catch (error) {
      throw new Error(`Error fetching user details: ${error.response?.data ?? error.message}`);
    }
  }

  async fetchUserId(username) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/usernames/users`,
        { usernames: [username] },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      return response.data.data[0].id;
    } catch (error) {
      throw new Error(`Error fetching user ID: ${error.response?.data ?? error.message}`);
    }
  }

  userValidation = async(req,res,next)=>{
    try {
      const { username, description } = req.body;
      const userDetails = await this.fetchUserDetails(username);

      if (userDetails !== description) {
        return res.status(401).json({ message: 'Description does not match' });
      }

      let user = await User.findOne({ username });

      if (!user) {
        user = new User({ username, description });
        await user.save();
      } else {
        user.description = description;
        await user.save();
      }

      // const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json("Successfully logged in");
    } catch (error) {
      next(error);
    }
  }

  // async protectedRoute(req, res, next) {
  //   try {
  //     const token = req.headers.authorization?.split(' ')[1];
  //     if (!token) {
  //       return res.status(401).json({ error: 'Unauthorized' });
  //     }

  //     // Verify JWT token
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //     const username = decoded.username;

  //     res.status(200).json({ message: 'Protected route accessed successfully' });
  //   } catch (error) {
  //     return res.status(401).json({ error: 'Unauthorized' });
  //   }
  // }
}

module.exports = new UserController(process.env.API_KEY);
