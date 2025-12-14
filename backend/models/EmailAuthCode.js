import mongoose from "mongoose";

const emailAuthCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    expiry: { type: Date, required: true , index: { expires: 0 }}
})

const EmailAuthCode = mongoose.model("EmailAuthCode", emailAuthCodeSchema);

export default EmailAuthCode;