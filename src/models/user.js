
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
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
    },

    password: {
        type: String,
        minLength: 8,
        maxLength: 16,
        required: true,
    },

    age: {
        type: Number,
        min: 18,
        

    },

    gender: {
        type: String,
        minLength: 4,
        maxLength: 6,
        validate(value) {
            if(!["male", "female", "other"].includes(value.toLowerCase())){
                throw new Error("Entered wrong gender!!")
            }
        }
    },

    photoUrl: {
        type: String,
        trim: true,
        default: "https://www.shutterstock.com/image-vector/default-avatar-social-media-display-picture-2632690107"
    },

    about: {
        type: String,
        maxLength: 500,
        
    },

    skills: {
        type: [String],
    }

});

const User = mongoose.model("User", userSchema);

module.exports = User;