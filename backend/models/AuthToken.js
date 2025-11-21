import mongoose from "mongoose";

const authTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    createdAt: { type: Date, default: Date.now()},
    expiresAt: { type: Date, required: true }
})

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

export default AuthToken