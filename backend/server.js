import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connectDB } from './db.js';
import requireAuth from './middleware/requireAuth.js';
import authRouter from "./routes/auth.js";

const app = express();
const PORT = 8000;
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(cookieParser())
connectDB();

app.use('/', authRouter);
app.use(requireAuth)
app.get('/', (req, res) => {
    res.send({responseImage: "https://www.meme-arsenal.com/memes/1e2a9fd762ea734471057e75e17b952f.jpg"});
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})