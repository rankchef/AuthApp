import AuthToken from "../models/AuthToken.js";
import User from "../models/User.js";
import crypto from "crypto";
function handleRoleStatus(roles = []){
    return async (req, res, next) => {
        const tokenCookie = req.cookies.token;
        if (!tokenCookie){
            return res.status(401).json({authenticated: false, errorMessage: "No authentication cookie received. Authentication failed."})
        }
        const [token, selector] = tokenCookie.split(":")
        
        if (!token || !selector) {
            return res.status(401).json({authenticated: false, errorMessage: "Invalid authentication cookie format. Authentication failed." });
        }
        const authRecord = await AuthToken.findOne({selector})

        if (!authRecord) {
            return res.status(401).json({authenticated: false, errorMessage: "Authentication cookie doesn't match records. Authentication failed" });
        }

        if (authRecord.expiresAt < new Date()){
            await AuthToken.deleteOne({_id: authRecord._id})
            return res.status(401).json({authenticated: false, errorMessage: "Authentication token expired. Please login again."})
        }

        const hashed = crypto.createHash("sha256").update(token).digest("hex");
        if (hashed != authRecord.hashedToken){
            return res.status(401).json({authenticated: false, errorMessage: "Invalid token" });
        }
        const userId = authRecord.userId;
        const user = await User.findOne({_id: userId})
        if (roles.length > 0 && !roles.includes(user.role)) return res.status(403).json({authenticated: false, errorMessage: `Users with role "${user.role}" aren't authorized.` });
        req.user = user;
        next();
    }
}
export default handleRoleStatus;
