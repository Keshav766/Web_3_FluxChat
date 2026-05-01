import express from "express";
import dotenv from "dotenv";
import ConnectToDB from "./configs/DBConnection.js";
import User from "./models/user.model.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const port = process.env.PORT || 9991;
const db_url = process.env.MONGODB_URL;

app.use(cors({
    origin: "https://fluxchat-cq1e.onrender.com",
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

server.listen(port, () => {
    ConnectToDB();
    console.log(`Server started at ${port}`)
})
