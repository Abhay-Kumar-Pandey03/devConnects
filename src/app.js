const express = require('express');

const app = express();

//We can send any number of route handlers as an array.
//We can use it in any route method (get, post, put, delete, all, use).
//Wrapping any number of route handlers in an array doesn't have any effect on the response.
// app.use("/route", [rH1, rH2, rH3, ...]);

app.use("/user", (req, res, next)=> {
    next();
    console.log("Route Handler");
    // res.send("Response");
}, (req, res, next)=> {
    console.log("Route Handler 2");
    // res.send("Response 2");
    next();
}, (req, res, next)=> {
    console.log("Route Handler 3");
    // res.send("Response 3");
    next();
}, (req, res, next)=> {
    console.log("Route Handler 4");
    res.send("Response 4");
    next();
});

app.listen(3000, () =>{
    console.log("Server is successfully running on port 3000");
});






