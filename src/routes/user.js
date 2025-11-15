const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userData = "firstName lastName age gender about skills";
//Getting all the pending requests of loggedIn user
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        const requests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested"
        }).populate(
            "fromUserId",
            userData);
            // ["firstName", "lastName"]);

        res.json({
            message: "Data fetched successfully",
            data: requests,
        });

    }
    catch(err) {
        res.status(404).send("Error : " + err.message);
    }
});

//Getting all connected users
userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId : loggedInUser._id, status : "accepted"},
                {toUserId : loggedInUser._id, status : "accepted"},
            ]
        })
        .populate("fromUserId", userData)
        .populate("toUserId", userData);

        // console.log(connections);
        const data = connections.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
            // row.fromUserId;
        });

        // console.log(data);

        res.json({message: "People connected with you", data : data});
    }
    catch(err) {
        res.status(404).send("Error : " + err.message);
    }
});

//User feed API
userRouter.get("/feed", userAuth, async(req, res) => {
    try {

        loggedInUser = req.user;
        const page = parseInt( req.query.page ) || 1;
        let limit = parseInt( req.query.limit ) || 10;

        limit = limit > 50 ? 50 : limit;
        const skip = ( page - 1 ) * limit;

        //Find all the connection requests (sent + received)
        const connectionRequests = await ConnectionRequest.find({
            $or : [
            {fromUserId : loggedInUser._id},
            {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideFromUser = new Set();
        connectionRequests.forEach(req => {
            hideFromUser.add(req.fromUserId.toString());
            hideFromUser.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and : [
                { _id: { $nin: Array.from(hideFromUser) } },
                { _id : { $ne : loggedInUser._id } }
            ]
        })
        .select(userData)
        .skip(skip)
        .limit(limit);

        res.send(users);

    }
    catch(err) {
        res.status(400).json({ message : err.message });
    }
})

module.exports = userRouter;