import AuthToken from "../models/AuthToken.js";
import User from "../models/User.js";

const requireAuth = async (req, res, next) => {
    const token = req.cookies.token
    if (!token){
        return res.status(401).json({errorMessage: "This is a protected route. Please authenticate first" , responseImage: "https://www.meme-arsenal.com/memes/f7f7f1287442780dfd544539f6dc2f15.jpg"})
    }
    const authRecord = await AuthToken.findOne({token})
    if (!authRecord){
        return res.status(401).json({errorMessage: "Invalid token", responseImage: "https://www.meme-arsenal.com/memes/f7f7f1287442780dfd544539f6dc2f15.jpg"})
    }
    if (authRecord.expiresAt < new Date()){
        await AuthToken.deleteOne({_id: authRecord._id})
        return res.status(401).json({errorMessage: "Expired token", responseImage: "https://www.meme-arsenal.com/memes/f7f7f1287442780dfd544539f6dc2f15.jpg"})
    }
    const userId = authRecord.userId;
    const user = await User.findOne({_id: userId})
    req.user = user;
    next();
}

export default requireAuth