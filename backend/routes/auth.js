import { Router } from "express";

import User from '../models/User.js';
import AuthToken from '../models/AuthToken.js';
import TwoFactorCode from "../models/twoFactorCode.js";
import EmailAuthCode from "../models/EmailAuthCode.js";

import generateRandomString from '../utils/generateRandomString.js';
import bcrypt from "bcrypt";
import crypto from "crypto";
import { validateRegister} from "../validators/authValidators.js";

import handleLoginCreds from "../middleware/handleLoginCreds.js";
import handleTwoFactor from "../middleware/handleTwoFactor.js";
import handleRoleStatus from "../middleware/handleRoleStatus.js";
import handleVerifyEmail from "../middleware/handleVerifyEmail.js";
import handleSendToken from "../middleware/handleSendToken.js";

const router = Router();

router.post('/register', validateRegister ,async (req,res) =>{
    const { username, email, password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username, email, password: hashedPassword})
    await newUser.save();   
    res.status(201).json({ message: "User registered successfully!" });
})

router.post('/login', 
    handleLoginCreds, 
    handleVerifyEmail, 
    handleTwoFactor, 
    async (req,res) =>{
        return handleSendToken(req, res);
})

router.get('/logout', async (req, res) => {
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

router.get('/toggle-2fa', handleRoleStatus(), async(req, res) => {
    
    const { email, twoFactor } = req.user;
    try{
        await User.findOneAndUpdate(
        {email},
        {twoFactor: !twoFactor},
        { new: true }
        )
        res.json({message: "2FA state updated successfully"});
    }

    catch{
        res.status(500).json({error: "Something went wrong updating 2fa."})
    }
    
})

router.post('/change-password', handleRoleStatus(), async (req, res) => {
    const { _id, password } = req.user;
    const { oldPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(oldPassword, password)
    if (!isMatch) return res.status(400).json({errorMessage: "Incorrect old password"});
    if (newPassword.length < 8) res.status(400).json({errorMessage: "New password is too short."})
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(_id, {password: hashedPassword})
    res.json({message: "Password changed successfully"})
})

router.post('/verify-2fa', async (req, res) => {
    const { email, code } = req.body;
    const codeEntry = await TwoFactorCode.findOne({email, code});

    if (!codeEntry){
        res.status(404).json({errorMessage: "The entered code was wrong"});
        return;
    } 
    
    const user = await User.findOne({email});
    req.user = user;
    return (handleSendToken(req, res));
});

router.get('/verify-email', async (req, res) => {
    const code = req.query.code;
    if (!code) res.status(404).json({error: "Invalid request"});
    
    const codeEntry = await EmailAuthCode.findOne({code})
    if (!codeEntry) {
        res.status(500).json({error: "Invalid email verification code"})
        return;
    }
    const { email } = codeEntry;
    const user = await User.findOneAndUpdate(
        {email},
        {emailVerified: true},
        { new: true }
    );

    await EmailAuthCode.deleteOne({ _id: codeEntry._id });

    res.redirect('http://localhost:5173/login')
})

router.get("/auth-status", handleRoleStatus(), (req, res) => {
    const { _id, username, email, role, emailVerified, twoFactor } = req.user;
    const authStatus = {authenticated: true, user_data: {_id, username, email, role, emailVerified, twoFactor}}
    res.json(authStatus);  
})

export default router;
