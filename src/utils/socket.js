const socket = require("socket.io");
const crypto = require("crypto");
const socketAuth = require("../middlewares/socketAuth");

const getUniqueRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256")
        .update([userId, targetUserId].sort().join("_"))
        .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            // methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use(socketAuth);

    io.on("connection", (socket) => {
        const userId = socket.user._id;
        const firstName = socket.user.firstName;
        //Handle events here
        socket.on("joinChat", ({ targetUserId}) => {
            if (!targetUserId) return;
            const roomId = getUniqueRoomId(userId, targetUserId);
            console.log(firstName + " joined room " + roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage", ({ targetUserId, text}) => {
            if (!targetUserId || !text?.trim()) return;
            const roomId = getUniqueRoomId(userId, targetUserId);
            console.log(firstName + " sent message " + text);
            io.to(roomId).emit("messageReceived", {senderId: userId,firstName, text});
        });


        socket.on("disconnect", () => {});
    });
};

module.exports = initializeSocket;