import AuthToken from "../models/AuthToken.js";
import crypto from "crypto";
import generateRandomString from "../utils/generateRandomString.js";

const handleSendToken = async (req, res, next) => {
    const { user } = req;
    const {_id, username, email, role, emailVerified, twoFactor} = user;
    const createdAt = new Date(Date.now());
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
    }).json({username, email, role, _id, emailVerified, twoFactor});
}

export default handleSendToken;