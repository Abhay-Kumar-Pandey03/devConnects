const express = require('express');

const app = express();

app.use("/",(req,res) => {
    res.send( "Hello from dashboard"); // Request handler
});

app.use("/hello",(req,res) => {
    res.send( "Hello hello server"); // Request handler
});

app.use("/test",(req,res) => {
    res.send( "Hello from server"); // Request handler
});

app.listen(3000, () =>{
    console.log("Server is successfully running on port 3000");
});






