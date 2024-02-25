const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const coinFlipRoutes = require("./routes/coinFlipRoutes")
const bodyParser = require("body-parser");
const port = 9000;
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const socketIo = require("socket.io");
const http = require("http");
dotenv.config({ path: __dirname + "/.env" });
app.use(express.static(__dirname));

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/coinFlip", coinFlipRoutes);

io.on("connection", (socket) => {
  console.log("connected");

  // socket.on("register", (token) => {
  //   if (!token) {
  //     return { Error: "Please Sign in !" };
  //   }
  //   const username = jwt.verify(token, secretKey).username;
  //   userSocket[username] = socket.id;
  // });

  socket.on("discussion_send_message", (messageData) => {
    try {
      // Extract the message and username from the messageData
      console.log(messageData);
      const { user, text } = messageData;
      console.log(user);

      //     // You can optionally validate the message here
      //     if (typeof username !== "string" || typeof message !== "string") {
      //       // Handle invalid message format
      //       return;
      //     }

      // Broadcast the message to all connected users, including the sender
      socket.broadcast.emit("discussion_message", { user, text });
    } catch (error) {
      console.error("Error sending chat message:", error);
      // Handle any potential errors when sending messages
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
