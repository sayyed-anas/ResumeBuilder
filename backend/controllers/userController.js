import { generateToken } from "../config/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// REGISTER USER FUNCTION
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CHECK IF USER ALREADY EXIST
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        succes: false,
        message: "Password must be atleast of 8 characters",
      });
    }

    // HASHING PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE A USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Register Error", error: error.message });
  }
};

// LOGIN USER FUNCTION
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "Invalid email or password" });
    }

    // COMPARE THE PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ message: "Invalid Password" });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login Error", error: error.message });
  }
};

// GET USER PROFILE FUNCTION
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "User Profile Error", error: error.message });
  }
};
