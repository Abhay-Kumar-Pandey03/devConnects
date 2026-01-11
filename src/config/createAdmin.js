require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");

mongoose.connect(process.env.DB_CONNECTION_SECRET);

const createAdmin = async () => {
    const admin = await User.create({
        firstName: "Abhay",
        lastName: "Pandey",
        emailId: "abhaypandey@gmail.com",
        password: "Abhay@Pandey##21438",
        role: "admin",
    });

    console.log("Admin created:", admin.emailId);
    process.exit();
};

createAdmin();
