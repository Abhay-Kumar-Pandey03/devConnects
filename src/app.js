const express = require('express');

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

//Sign up a user
app.post("/signup", async (req, res) => {
    
  //Creating an instance of User model
  const user = new User(req.body);

    try{
      await user.save();
      res.send("User signed up successfully");
    }
    catch(err) {
      res.status(400).send("Error in signing up the user" + err,message);
    }

});

//Get a user by email
app.get("/feed", async (req,res) => {
  const userEmail = req.body.emailId;

  try{
    const users = await User.find({emailId: userEmail});
    if(users.length === 0){
      res.status(404).send("User not found");
      
    }
    else{
      res.send(users);
    }
  }
  catch(err){
    res.status(400).send("❌ Something went wrong");
  }
});


//Get all users
app.get("/feed", async (req,res) => {
  try{

    const users = await User.find({});
    res.send(users);
  }
  catch(err){
    res.status(400).send("❌ Something went wrong");
  }
});

//Using findOne() method to get a single user - returns the oldest document that matches the query criteria.
app.get("/feed", async (req,res) =>{
  const userEmail = req.body.emailId;
  try{
    const users = await User.findOne({emailId: userEmail});
    if(!users){
      res.status(404).send("User not found");
    }
    else{
      res.send(users);

    }
  }
  catch(err){
    res.status(400).send("something went wrong");
  }
});

//Deleting a user
app.delete("/user", async (req, res) => {
  
  const userId = req.body.userId;
  
  try{
    const users = await User.findByIdAndDelete(userId);
    // const users = await User.findByIdAndDelete({_id: userId});
    res.status(200).send("User deleted successfully");
  }
  catch(err){
    res.status(400).send("Error in deleting the user");
  }

});

//Updating a user
app.patch("/user", async (req,res) => {
  const userId = req.body.userId;

//   try{
//     const data = req.body;
//     const user = await User.findByIdAndUpdate(userId, data);
//     res.status(200).send("User updated successfully");
//   }
//   catch(err){
//     res.status(400).send("Error in updating the user");
//   }
});

//Updating a user using emailId
app.patch("/user", async (req,res) => {
  const emailId = req.body.emailId;

  try{
    const data = req.body;
    const user = await User.findByIdAndUpdate(emailId, data);
    res.status(200).send("User updated successfully");
  }
  catch(err){
    res.status(400).send("Error in updating the user");
  }
});


connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(3000, () =>{
    console.log("Server is successfully running on port 3000");
  });
})
  .catch((err) => {
    console.log("Database cannot be connected !!");
  });









