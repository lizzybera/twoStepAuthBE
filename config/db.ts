import mongoose from "mongoose"

const URL : string = "mongodb://localhost:27017/article"

const db = () =>{
    mongoose.connect(URL).then(()=>{
        console.log("server is connected"); 
    })
}

export default db