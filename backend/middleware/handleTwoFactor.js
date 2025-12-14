import nodemailer from "nodemailer";
import TwoFactorCode from "../models/twoFactorCode.js";
import generateRandomString from "../utils/generateRandomString.js";

const handleTwoFactor = async (req, res, next) => {
  const { user } = req;
  if (!user.twoFactor) return next();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const code = generateRandomString(6).toLowerCase();
  const {email, username} = req.user;
  const expiry = new Date(Date.now() + 5 * 60 * 1000);
  try{    
      await TwoFactorCode.findOneAndUpdate(
          { email },
          { code, expiry },
          { upsert: true, new: true }
      );
      
      await transporter.sendMail({
      from: `"ISecurity" <${process.env.EMAIL_USER}>`,
      to: `${email}`,
      subject: "Your ISecurity 2FA verification code",
      html: `<h3>Dear ${username},</h3></br>
      Please use the following verification code: <b>${code}</b>
      `
      })
      res.status(401).json({errorMessage: "2FA required"});
      }
      catch (err){
      console.log(err);
      res.status(500).json({errorMessage: "There was an error sending a 2FA code"})
      }
}

export default handleTwoFactor;