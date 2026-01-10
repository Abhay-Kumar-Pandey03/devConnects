const socket = require("socket.io");
const crypto = require("crypto");
const socketAuth = require("../middlewares/socketAuth");
const { Chat } = require("../models/chat");
const connectionRequest = require("../models/connectionRequest");

const onlineUsers = new Map();

const getUniqueRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256")
        .update([userId, targetUserId].sort().join("_"))
        .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: true,
            // methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use(socketAuth);

    io.on("connection", (socket) => {
        const userId = socket.user._id.toString();
        const firstName = socket.user.firstName;
        const lastName = socket.user.lastName;

        const currentOnline = onlineUsers.get(userId) || 0;
        onlineUsers.set(userId, currentOnline + 1);

        if (currentOnline === 0) {
            io.emit("userOnline", userId);
        }


        //Handle events here

        socket.on("joinChat", async ({ targetUserId }) => {

            try {
                if (!targetUserId) return;

                const isConnected = await connectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
                    ]
                });

                if (!isConnected) {
                    socket.emit("errorMessage", "You are not connected to this user.");
                    return;
                }

                const roomId = getUniqueRoomId(userId, targetUserId);
                console.log(firstName + " joined room " + roomId);
                socket.join(roomId);
                socket.emit("connectionSuccess");

            } catch (err) {
                console.error("Error in joinChat:", err);
            }

        });

        socket.on("getOnlineUsers", () => {
            socket.emit("onlineUsers", Array.from(onlineUsers.keys()));
        });

        socket.on("sendMessage", async ({ targetUserId, text }) => {
            try {

                const isConnected = await connectionRequest.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
                    ]
                });

                if (!isConnected) {
                    socket.emit("errorMessage", "You are not connected to this user.");
                    return;
                }

                if (!targetUserId || !text?.trim()) return;

                if (text.length > 1000) {
                    socket.emit("errorMessage", "Message too long");
                    return;
                }


                const roomId = getUniqueRoomId(userId, targetUserId);
                console.log(firstName + " sent message " + text);

                //Save messages to the database
                let chat = await Chat.findOne({
                    //For two or more participants
                    participants: { $all: [userId, targetUserId] }
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text,
                });

                await chat.save();

                io.to(roomId).emit("messageReceived", { senderId: userId, firstName, lastName, text });
            }
            catch (err) {
                console.error("Error handling sendMessage:", err);
            }

        });


        socket.on("disconnect", () => {
            const count = (onlineUsers.get(userId) || 1) - 1;

            if (count <= 0) {
                onlineUsers.delete(userId);
                io.emit("userOffline", userId);
            }
            else {
                onlineUsers.set(userId, count);
            }
        });
    });
};

module.exports = initializeSocket;