const jwt = require("jsonwebtoken");
const User = require("../models/user");

const socketAuth = async (socket, next) => {
    try {
        const cookie = socket.request.headers.cookie;
        if (!cookie) {
            return next(new Error("Authentication error"));
        }

        const token = cookie
            .split("; ")
            .find((c) => c.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return next(new Error("No token found"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔴 THIS IS THE KEY PART
        const user = await User.findById(decoded._id).select(
            "_id firstName lastName emailId photoUrl"
        );

        if (!user) {
            return next(new Error("User not found"));
        }

        socket.user = user; // ✅ full user attached
        next();
    } catch (err) {
        next(new Error("Authentication failed"));
    }
};

module.exports = socketAuth;
