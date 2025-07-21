import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import AuthRoutes from './routes/auth.routes.js';
import MessageRoutes from './routes/message.routes.js';
import { connectDB } from './lib/db.js';
import {app, server} from './lib/socket.js';

import path from 'path';


dotenv.config();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "https://real-time-chat-application-taupe.vercel.app" || "http://localhost:5173",
    credentials: true,
}));

const __dirname = path.resolve();

const PORT = process.env.PORT

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);


server.listen(PORT, () => {
    console.log('Server is running on port:' + PORT);
    connectDB();
})