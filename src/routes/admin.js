const express = require("express");
const { adminAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest")

const adminRouter = express.Router();

// Admin dashboard test route
adminRouter.get("/dashboard", adminAuth, (req, res) => {
    res.json({
        message: "Welcome Admin",
        admin: req.user.firstName,
    });
});

adminRouter.get("/admin/stats", adminAuth, async (req, res) => {
    try {
        const users = await User.countDocuments();
        const premiumUsers = await User.countDocuments({ isPremium: true });
        const connections = await ConnectionRequest.countDocuments({
            status: "accepted",
        });

        res.json({
            users,
            premiumUsers,
            connections,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch stats" });
    }
});

module.exports = adminRouter;
