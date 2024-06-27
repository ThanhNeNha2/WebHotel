import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // Xử lý khi có client kết nối mới
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(`User connected: ${userId}`);
  });

  // Xử lý khi client gửi tin nhắn
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  // Xử lý khi client ngắt kết nối
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

io.listen(4000);
console.log("Server is running on port 4000");
