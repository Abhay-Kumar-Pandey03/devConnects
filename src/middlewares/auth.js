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

const userAuth = async(req, res, next) =>{
    try{

//        console.log("Inside auth middleware");

    //Read the token from req cookies
    const cookies = req.cookies;
    const {token} = cookies;
    
    //Validate the token
    if(!token){
        return res.status(401).send("Please Login");
    }
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const {_id} = decodedMessage;

    //Find the user
    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();
    }
    catch(err) {
        res.status(400).send("Error : " + err.message);
    }
}

module.exports = {
    adminAuth,
    userAuth,
}