const validator = require("validator");

const validateFirstName = (firstName) => {
    if (!firstName || firstName.trim().length < 2 || firstName.trim().length > 30)
        return "First name must be between 2 and 30 characters";
    if (!/^[A-Za-z]+$/.test(firstName.trim()))
        return "First name should contain only letters";
    return null;
};

const validateLastName = (lastName) => {
    if (!lastName || lastName.trim().length < 2 || lastName.trim().length > 30)
        return "Last name must be between 2 and 30 characters";
    if (!/^[A-Za-z]+$/.test(lastName.trim()))
        return "Last name should contain only letters";
    return null;
};

const validateAge = (age, data) => {
    if (!/^\d+$/.test(age))
        return "Age must contain only numbers";
    const ageNum = Number(age);
    if (ageNum < 18 || ageNum > 100)
        return "Age must be between 18 and 100";
    if (data) data.age = ageNum; // convert string to number
    return null;
};

const validateGender = (gender) => {
    if (!["male", "female", "other"].includes(gender.toLowerCase()))
        return "Entered wrong gender";
    return null;
};

const validatePhotoUrl = (photoUrl) => {
    const trimmedUrl = photoUrl.trim();
    if (trimmedUrl === "") return "Photo URL cannot be empty";
    if (!validator.isURL(trimmedUrl)) return "Invalid photo URL";
    return null;
};

const validateAbout = (about) => {
    if (!about || about.trim().length === 0) return null;
    if (about.trim().length < 10 || about.trim().length > 300)
        return "About must be between 10 and 300 characters";
    return null;
};

const validateSkills = (skills) => {
    if (skills.length > 10) return "Skills cannot be more than 10";
    return null;
};

/* ---------- SIGN UP ---------- */

const validateSignUpData = (req, res, next) => {
    const data = req.body;

    const checks = [
        validateFirstName(data.firstName),
        validateLastName(data.lastName),
        !data?.emailId || !validator.isEmail(data.emailId) ? "Invalid Email ID" : null,
        !data?.password || !validator.isStrongPassword(data.password)
            ? "Password must contain uppercase, lowercase, number & special character (at least 8 characters)"
            : null,
        data.age !== undefined ? validateAge(data.age, data) : null,
        data.gender ? validateGender(data.gender) : null,
        typeof data?.photoUrl === "string" ? validatePhotoUrl(data.photoUrl) : null,
        data.about ? validateAbout(data.about) : null,
        Array.isArray(data.skills) ? validateSkills(data.skills) : null,
    ];

    const error = checks.find((e) => e !== null);
    if (error) return res.status(400).json({ message: error });

    next();
};

/* ---------- EDIT PROFILE ---------- */

const validateEditProfileData = (req) => {
    const data = req.body;

    const allowedEdits = ["firstName", "lastName", "about", "skills", "gender", "age", "photoUrl"];

    // Remove unwanted fields
    Object.keys(data).forEach((key) => {
        if (!allowedEdits.includes(key)) delete data[key];
    });

    if (data.firstName !== undefined) {
        const err = validateFirstName(data.firstName);
        if (err) return err;
    }
    if (data.lastName !== undefined) {
        const err = validateLastName(data.lastName);
        if (err) return err;
    }
    if (data.age !== undefined) {
        const err = validateAge(data.age, data);
        if (err) return err;
    }
    if (data.about !== undefined) {
        const err = validateAbout(data.about);
        if (err) return err;
    }
    if (data.gender !== undefined) {
        const err = validateGender(data.gender);
        if (err) return err;
    }
    if (typeof data?.photoUrl === "string") {
        const err = validatePhotoUrl(data.photoUrl);
        if (err) return err;
    }
    if (Array.isArray(data.skills)) {
        const err = validateSkills(data.skills);
        if (err) return err;
    }

    return null;
};

module.exports = { validateSignUpData, validateEditProfileData };