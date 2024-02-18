const axios = require('axios');

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
      const { username } = req.body;
      const { description } = req.body;
      const userDetails = await this.fetchUserDetails(username);
  
      if (userDetails === description) {
        res.status(200).json({ message: 'Successfully logged in' });
      } else {
        res.status(401).json({ message: 'Description does not match' });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController(process.env.API_KEY);
