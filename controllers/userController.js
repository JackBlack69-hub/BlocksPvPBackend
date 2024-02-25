const axios = require("axios");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

class UserController {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://users.roblox.com/v1';
    this.secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwODM2ODg2NywiaWF0IjoxNzA4MzY4ODY3fQ.v_VK4rM8Z6rKJlOVV023dV2wzzt7qbsWRD2uq7FfiCM'
  }

  async fetchUserDetails(username) {
    try {
      const userId = await this.fetchUserId(username);
      const response = await axios.get(`${this.baseUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.data.description;
    } catch (error) {
      throw new Error(
        `Error fetching user details: ${error.response?.data ?? error.message}`
      );
    }
  }

  async fetchUserId(username) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/usernames/users`,
        { usernames: [username] },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.data.data[0].id;
    } catch (error) {
      throw new Error(
        `Error fetching user ID: ${error.response?.data ?? error.message}`
      );
    }
  }

  userValidation = async (req, res, next) => {
    try {
      const { username, description } = req.body;
      console.log(req.body)
      const userDetails = await this.fetchUserDetails(username);

      if (userDetails !== description) {
        return res.status(401).json({ message: "Description does not match" });
      }

      let user = await User.findOne({ username });

      if (!user) {
        user = new User({ username, description });
        await user.save();``
      } else {
        user.description = description;
        await user.save();
      }

      const token = jwt.sign({ username }, this.secretKey, {
        expiresIn: "7d",
      });

      res
        .status(200)
        .json({
          message: "Successfully logged in",
          statusCode: 200,
          token: token,
        });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decoded = jwt.verify(token, this.secretKey);
    res.status(200).send({ decoded });
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
  
}

module.exports = new UserController(process.env.API_KEY);
