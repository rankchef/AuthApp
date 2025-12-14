import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["user", "mod", "admin"], default: "user" },
    emailVerified: { type: Boolean, default: false},
    twoFactor: { type: Boolean, default: false},
});

const User = mongoose.model("User", userSchema);

export default User;