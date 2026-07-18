const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validateSignUpData } = require("../utils/validation");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { MODELS } = require("../utils/constants");

//Get profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("User not found");
        }
        res.send(user);
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

//Edit profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try {

        const error = validateEditProfileData(req);

        if (error) {
            return res.status(400).json({ message: error });
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();

        return res.json({
            message: `${loggedInUser.firstName}, profile updated`,
            data: loggedInUser,
        });

    } catch (err) {
        console.error("ERROR INSIDE PATCH:", err);
        return res.status(500).json({
            message: err.message || "Internal server error",
        });
    }
});

// Forgot Password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {

    try {

        const newPassword = req.body.password;

        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("Enter a strong password");
        }

        const hashChangePassword = await bcrypt.hash(newPassword, 10);
        const loggedInUser = req.user;

        loggedInUser.password = hashChangePassword;
        await loggedInUser.save();

        res.send("Password changed successfully");
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

// AI Bio Generator
profileRouter.post("/profile/ai-generate-bio", userAuth, async (req, res) => {
    try {
        const skills = req.body.skills || req.user.skills || [];
        if (!skills || skills.length === 0) {
            return res.status(400).json({ message: "Please add some skills to your profile." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const prompt = `Write a short, professional, and friendly developer bio (max 3 sentences, under 200 characters) for a developer who knows: ${skills.join(", ")}. 
        Make it sound natural and personal, not generic. Do not use bullet points. Just plain text.`;

        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const bio = result.response.text();
                return res.json({ bio });
            } catch (err) {
                if (!err.message.includes("429") && !err.message.includes("404")) throw err;
            }
        }

        return res.status(429).json({ message: "All models quota exceeded. Try again later." });

    } catch (err) {
        res.status(500).json({ message: "AI generation failed: " + err.message });
    }
});


module.exports = profileRouter;