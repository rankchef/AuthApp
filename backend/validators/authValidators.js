import User from '../models/User.js';
import bcrypt from "bcrypt"
export const validateRegister = async (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body

    const errors = {}; 
    if (!username || username.trim() == "") errors.username = "Username is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = "Email format is invalid";
    if (password.length < 8) errors.password = "Password should be at least 8 characters long";
    if (password != confirmPassword) errors.confirmPassword = "Passwords should be the same";
    if (!errors.email){
        const existingUser = await User.findOne({email})
        const existingUserByUsername = await User.findOne({username})
        if (existingUser) errors.email = "Email is already in use";
        if (existingUserByUsername) errors.username = "Username is already taken"
    }
    if (Object.keys(errors).length > 0){
        return res.status(400).json(errors);
    }

    next();
}


