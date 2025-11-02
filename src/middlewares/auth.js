const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// const adminAuth = (req, res) => {
//     const token = "xyz";
//     const adminToken = "xyz";
//     if(adminToken !== token){
//         res.status(401).send("Unauthorized Access");
//     }
//     else{
//         next();
//     }
// }

// const userAuth = (req, res) =>{
//     const token = "abc";
//     const userToken = "abc";
//     if(userToken !== token){
//         res.status(401).send("Unauthorized access");
//     }
//     else{
//         next();
//     }
// }

const userAuth = async(req, res, next) =>{
    try{
    //Read the token from req cookies
    const cookies = req.cookies;
    const {token} = cookies;
    
    //Validate the token
    if(!token){
        throw new Error("Token is not valid");
    }
    const decodedMessage = await jwt.verify(token, "Abhay@2004");
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
    // adminAuth,
    userAuth,
}