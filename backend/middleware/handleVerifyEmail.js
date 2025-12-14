import EmailAuthCode from "../models/EmailAuthCode.js";
import generateRandomString from "../utils/generateRandomString.js";
import nodemailer from "nodemailer";

const handleVerifyEmail = async (req, res, next) => {
    const { user } = req; 
    if (user.emailVerified) {
      return next();
    }
    const code = generateRandomString(15)
    const {email, username} = user;
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    await EmailAuthCode.findOneAndUpdate(
        { email },
        { code, expiry },
        {upsert: true, new: true}
    );

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
    });

    const verifyLink = `http://localhost:8000/auth/verify-email?code=${code}`

    await transporter.sendMail({
      from: `"ISecurity" <${process.env.EMAIL_USER}>`,
      to: `${email}`,
      subject: "Verify your ISecurity account",
      html: `<h3>Dear ${username},</h3></br>
      <p>Please press on the following link to verify your e-mail address:</p> 
      <a href=${verifyLink}>Verify email</a>
      `
      })

    return res.status(401).json({errorMessage: "Email verification required"})
}

export default handleVerifyEmail;