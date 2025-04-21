import jwt from "jsonwebtoken";
import UserModel from "../models/Auth.js";


const Verification = async (req,res,next) =>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(303).json({sucess:false,message:"Unautherised please login"})
        }
        const decoded = await jwt.decode(token,process.env.jwt)
        const user = await UserModel.findById(decoded.userID)
        req.userID = user._id;
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({sucess:false,message:"internal server error "})
    }
}
export  {Verification}