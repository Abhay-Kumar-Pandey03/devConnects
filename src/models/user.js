
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        // index : true,
        trim: true,
        maxLength: 30,
    },

    lastName: {
        type: String,
        trim: true,
        maxLength: 30,
    },

    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email ID");
            }
        }
    },

    password: {
        type: String,
        minLength: 8,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough");
            }
        }
    },

    age: {
        type: Number,
        min: 18,


    },

    gender: {
        type: String,
        minLength: 4,
        maxLength: 6,
        enum: {
            values: ["male", "female", "other"],
            message: "${VALUE} is not a gender type"
        },
        // validate(value) {
        //     if(!["male", "female", "other"].includes(value.toLowerCase())){
        //         throw new Error("Entered wrong gender!!")
        //     }
        // }
    },

    photoUrl: {
        type: String,
        trim: true,
        default: "https://www.shutterstock.com/shutterstock/photos/2632690107/display_1500/stock-vector-default-avatar-social-media-display-picture-icon-isolated-vector-illustration-2632690107.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL for photo");
            }
        }
    },

    about: {
        type: String,
        maxLength: 500,

    },

    skills: {
        type: [String],
        default: [],
    },

    isPremium: {
        type: Boolean,
        default: false,
        // select: false,
    },

    membershipType: {
        type: String,
        default: null,
        // select: false,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },


}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return token;
};

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isValidPassword;
};

module.exports = mongoose.model("User", userSchema);