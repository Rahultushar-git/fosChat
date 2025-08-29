// server.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

// serve files from public folder
app.use(express.static("public"));

// socket.io server
const io = new Server(http);

// store last 20 messages in memory
let messages = [];

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // send chat history to this new client
  socket.emit("chat history", messages);

  // handle incoming messages (msg = { user, text, time })
  socket.on("chat message", (msg) => {
    // add to history
    messages.push(msg);
    if (messages.length > 20) messages.shift(); // keep last 20

    // broadcast to everyone
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// listen on Render's port or local 3000
const PORT = process.env.PORT || 3000;
http.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

