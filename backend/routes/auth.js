import { Router } from "express";
import User from '../models/User.js';
import AuthToken from '../models/AuthToken.js';
import generateRandomString from '../utils/generateRandomString.js';
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validateRegister, validateLogin } from "../validators/authValidators.js";
import TwoFactorCode from "../models/twoFactorCode.js";
import { error } from "console";
import requireAuth from "../middleware/requireAuth.js";
import sendTwoFactorTo from "../middleware/sendTwoFactorTo.js";

const router = Router();

router.post('/register', validateRegister ,async (req,res) =>{
    const { username, email, password, confirmPassword } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username, email, password: hashedPassword})
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
})

router.post('/login', validateLogin, sendTwoFactorTo, async (req,res) =>{

})

router.get('/logout', async (req, res) => {
    console.log("logout raboti")
    const tokenCookie = req.cookies.token;
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    if (!tokenCookie) {
        return res.json({ success: true });
    }

    const parts = tokenCookie.split(':');
    if (parts.length !== 2) {
        return res.json({ success: true });
    }

    const [token, selector] = parts;

    try {
        await AuthToken.deleteOne({ selector });
    } catch (err) {
        return res.json({ success: true });
    }

    return res.json({ success: true });
});


router.post('/verify-2fa', async (req, res) => {
    const { email, code } = req.body;
    const codeEntry = await TwoFactorCode.findOne({email, code});

    if (!codeEntry){
        res.status(500).json({errorMessage: "The entered code was wrong"});
    }
    else{
        const user = await User.findOne({email});
        const { _id } = user;
        const createdAt = new Date(Date.now());``
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        const token = generateRandomString(30);
        const selector = generateRandomString(15);
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const authToken = new AuthToken({selector, hashedToken, userId: _id, createdAt, expiresAt})
        await authToken.save();

        const cookie = token + ":" + selector;
        res.cookie("token", cookie, {
            httpOnly: true,
            maxAge: 30*24*60*60*1000,
            sameSite: "lax",
            secure: false
        }).json({message: "Login successful"});
    }
});

router.get("/auth-status", requireAuth, (req, res) => {
    const { username, email } = req.user;
    const authStatus = {authenticated: true, user_data: {username, email}}
    res.json(authStatus);
})
export default router;
