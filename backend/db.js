import mongoose from 'mongoose';


export const connectDB = async () => {
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/isecurity")
    }
    catch(err){
        console.error("MongoDB connection failed", err.message);
        process.exit(1);
    }
}
