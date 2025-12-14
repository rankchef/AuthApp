 import User from "../models/User.js";
 import bcrypt from "bcrypt"
 
 const handleLoginCreds = async (req, res, next) => {
    const {email, password} = req.body;   
    const user = await User.findOne({email});
    if (!user) return res.status(401).json({errorMessage: "Incorrect email or password"});
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({errorMessage: "Incorrect email or password"});
    
    req.user = user;
    next();
}

export default handleLoginCreds;