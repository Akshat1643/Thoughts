import UserModel from "../models/Auth.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields (username, email, password) are required.",
        });
      }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, email, password:hashPassword});
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
const Login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check for missing fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields (email and password) are required.",
        });
      }
  
      // Check if user exists
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User does not exist. Please sign up.",
        });
      }
  
      // Compare password
      const passCheck = await bcrypt.compare(password, existingUser.password);
      if (!passCheck) {
        return res.status(401).json({
          success: false,
          message: "Incorrect email or password.",
        });
      }
  
      // Login success
      const token = await jwt.sign ({userID:existingUser._id},process.env.jwt,{expiresIn:"3d"})
      res.cookie("token", token, {
        httpOnly: true,       // Prevent JS access
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in ms
        secure: false,        // Set to true in production (HTTPS)
        sameSite: "strict"
      });
      res.status(200).json({
        success: true,
        message: "User logged in successfully.",
        user: existingUser,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  };
  
  const Logout = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set to true in production (with HTTPS)
      sameSite: "strict",
    });
  
    res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  };
  
export { Register ,Login,Logout};
