import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const Dbcon = async()=>{
    try {
        mongoose.connect(process.env.db)
        console.log("connected to db suceesfullly")
    } catch (error) {
        console.log(error)
    }
}
export default Dbcon 