const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

/* ---------------- ADMIN AUTH ---------------- */
const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const userAuth = async (req, res, next) => {

    if (req.method === "OPTIONS") {
        return next();
    }

    try {

        //        console.log("Inside auth middleware");

        //Read the token from req cookies
        const cookies = req.cookies;
        // console.log("Cookies : ", cookies);
        const token = cookies?.token;

        //Validate the token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please Login"
            });
        }
        const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded msg : ", decodedMessage);  
        const { _id } = decodedMessage;

        //Find the user
        const user = await User.findById(_id);
        // console.log("User : ", user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        req.user = user;
        next();
    }
    catch (err) {
        console.error("Auth Error:", err);
        return res.status(401).json({
            success: false,
            message: err.message || "Authentication failed"
        });
    }
}

module.exports = {
    adminAuth,
    userAuth,
}