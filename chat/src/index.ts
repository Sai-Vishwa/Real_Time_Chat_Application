import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import router from "./router/router.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create HTTP server from Express app
const server = http.createServer(app);

// ✅ Attach Socket.io to the same HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for dev; restrict in production
  },
});

// 🧩 Express route (normal HTTP)
app.get("/", (req, res) => {
  res.send("Express + Socket.io server is running 🚀");
});

// ⚡ Socket.io real-time connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send-message", (data) => {
    console.log("Message received:", data);
    // broadcast message to everyone
    io.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(router)


// ✅ Start both together
server.listen(6000, () => {
  console.log("Server running on port 6000");
});
