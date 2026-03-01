const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

// Store online users
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("User registered:", userId);
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
    console.log("User disconnected");
  });
});

// Make io accessible globally
app.set("io", io);
app.set("onlineUsers", onlineUsers);

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});