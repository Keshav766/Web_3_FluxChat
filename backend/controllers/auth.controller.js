import { GenerateToken } from "../configs/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userByUsername = await User.findOne({ userName });
        if (userByUsername) {
            return res.status(400).json({ message: "username already exists" })
        }

        const userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ message: "email already exists" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password should be more than 6 characters" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName, email, password: hashedPassword
        })

        const token = GenerateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true
        })

        return res.status(201).json(user);

    } catch (err) {
        return res.status(500).json({ message: `signup error ${err.message}` });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "all fields are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (user === null) {
            return res.status(400).json({ message: "User not found/for dev" });
        }

        const verified = await bcrypt.compare(password, user.password);

        if (!verified) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = GenerateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true
        })

        return res.status(200).json(user);

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "None",
            secure: true
        });
        return res.status(200).json({ message: "log out successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
