const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const validator = require("validator");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

//Sign up a user
app.post("/signup", async (req, res) => {
  //Validation
  validateSignUpData(req);

  const {firstName, lastName, emailId, password} = req.body;

  //Encryption of password
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash);

  //Creating an instance of User model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });

  try {
    await user.save();
    res.send("User signed up successfully");
  } catch (err) {
    res.status(400).send("Error in signing up the user: " + err.message);
  }
});


//Login
app.post("/login", async(req, res) => {
  const{emailId, password} = req.body;

  try {
    const user = await User.findOne({ emailId : emailId})

    if(!user){
      throw new Error("Wrong credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if(isValidPassword){

      //Creating a JWT token
      const token = await jwt.sign({_id: user._id}, "Abhay@2004", {expiresIn : "7d"});

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000),});
      res.send("Login Successfull");
    }
    else{
      throw new Error("Invalid Credentials");
    }


  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

//Get profile
app.get("/profile", userAuth, async(req, res) => {
  try{
  const user = req.user;
  if(!user){
    throw new Error("User not found");
  }
  res.send(user.firstName + " " + user.lastName); 
  }
  catch(err) {
    res.status(400).send("Error : " + err.message);
  } 
});

app.post("/sendConnectionRequest", userAuth, async(req, res, next) =>{
  try{
    const user = req.user;
    if(!user){
      throw new Error("User not found");
    }

    res.send(user.firstName + " sent a connection request");
  }
  catch(err) {
    res.status(400).send("Error: " + err.message);
  }
});


connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(3000, () => {
      console.log("Server is successfully running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected !!");
  });
