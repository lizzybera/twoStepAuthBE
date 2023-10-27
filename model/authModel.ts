import mongoose from "mongoose";

interface iAuth {
    name : string,
    email : string,
    password : string,
    token : string,
    verified : boolean,
    otp : string,
    secret : boolean
}

interface iAuthData extends iAuth, mongoose.Document {}

const authModel = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String,
        trim : true
    },
    password : {
        type : String
    },
    token : {
        type : String
    },
    verified : {
        type : Boolean,
        default : false
    },
    otp : {
        type : String
    },
    secret : {
        type : Boolean,
        default : false
    },
}, {timestamps : true})

export default mongoose.model<iAuthData>("auths", authModel)