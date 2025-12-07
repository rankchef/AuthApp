import mongoose from "mongoose";

const twoFactorCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, },
    email: { type: String, required: true, unique: true},
    expiry: { type: Date, required: true , index: { expires: 0 }}
})

const TwoFactorCode = mongoose.model("TwoFactorCode" ,twoFactorCodeSchema);

export default TwoFactorCode;