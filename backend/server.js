import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import bcrypt from "bcrypt";
import { connectDB } from './db.js';
import User from './models/User.js';
import generateToken from './auth/generateToken.js';
import AuthToken from './models/AuthToken.js';

import requireAuth from './middleware/requireAuth.js';
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(cookieParser())
connectDB();

app.post('/login', async (req,res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(401).send({errorMessage: "Incorrect email or password"})
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({errorMessage: "Incorrect email or password"})
           
    const { _id } = user;
    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dena
    const token = generateToken();
    const authToken = new AuthToken({token, userId: _id, createdAt, expiresAt})
    
    authToken.save();
    
    res.cookie("token", token, {
    httpOnly: true,
    maxAge: expiresAt.getTime() - createdAt.getTime(),
    sameSite: "lax",
    secure: false
    })
    .json({message: "Login successful"});
})

app.post('/register', async (req,res) =>{
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({username, email, password: hashedPassword})
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
})

app.use(requireAuth)

app.get('/', (req, res) => {
    res.send({responseImage: "https://www.meme-arsenal.com/memes/1e2a9fd762ea734471057e75e17b952f.jpg", username: req.user.username});
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})