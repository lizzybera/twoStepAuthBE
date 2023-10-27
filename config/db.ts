import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const URL : string = process.env.DB!

const db = () =>{
    mongoose.connect(URL).then(()=>{
        console.log("server is connected"); 
    })
}

export default db