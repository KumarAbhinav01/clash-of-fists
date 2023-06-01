const dotenv = require("dotenv");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const roomHandler = require("./roomHandler");

dotenv.config();
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

const rooms = [];

io.on("connection", (socket) => {
  console.log("connected", socket.id);
  roomHandler(io, socket, rooms);
  
  socket.on("send_message", (data) => {
  console.log("Received message:", data);
  // io.to(data.room.roomId).emit("receive_message", data);
  socket.broadcast.to(data.room.roomId).emit("receive_message", data);

  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });

  
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
