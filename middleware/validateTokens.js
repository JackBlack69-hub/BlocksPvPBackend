const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Check if token exists

  if (!token) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const secretKey = "mySecretKey";

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, secretKey);
    console.log("decoded", decoded);

    // Check if token is expired
    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: "Token expired" });
    }

    // Token is valid
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { validateToken };
