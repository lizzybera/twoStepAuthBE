import { Request, Response } from "express";
import bcrypt from "bcrypt"
import authModel from "../model/authModel";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { OTPMail, verifyMail } from "../utils/emails";

export const register = async(req : Request, res : Response ) =>{
    try {
        const {name, email, password} = req.body

        const token = crypto.randomBytes(16).toString("hex")
        const otp = crypto.randomBytes(2).toString("hex")

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = await authModel.create({
            name, email, password : hash, token, otp
        })

      const tokenID = jwt.sign({id : user?._id}, "secret")

      OTPMail(user,tokenID).then(()=>{
        console.log("sent");
      })

        return res.status(201).json({
            message : "Registered",
            data : user, tokenID
        })

    } catch (error  : any) {
        return res.status(404).json({
            message : "Error Registering",
            data : error.message
        })
    }
}

export const users = async(req : Request, res : Response ) =>{
    try {

        const user = await authModel.find()

        return res.status(200).json({
            message : "users",
            data : user
        })

    } catch (error  : any) {
        return res.status(404).json({
            message : "Error viewing users",
            data : error.message
        })
    }
}

export const deleteUser = async(req : Request, res : Response ) =>{
    try {
        const {userID} = req.params

        const user = await authModel.findByIdAndDelete(userID)

        return res.status(200).json({
            message : `${user?.name} deleted`,
        })

    } catch (error  : any) {
        return res.status(404).json({
            message : "Error viewing users",
            data : error.message
        })
    }
}

export const Otp = async(req : Request, res : Response ) =>{
    try {
        const {token} = req.params
        const {otp} = req.body

        const userID : any = jwt.verify(token, "secret", (err, payload : any)=>{
            if(err){
                return err
            }else{
                return payload.id
            }
        })

        const user = await authModel.findById(userID)

       const tokenID = jwt.sign({id : userID}, "secret")

       verifyMail(user, tokenID)

        if (user) {
            if(user?.otp === otp){

                const user = await authModel.findByIdAndUpdate(userID, {secret : true}, {new : true})
                
                return res.status(201).json({
                message : "please proceed to verify",
                data : user
            })
    
            }else{
                return res.status(404).json({
                    message : "check otp",
                })
            }
        } else {
            return res.status(404).json({
                message : "user doesnt exist",
            })
        }
  

    } catch (error  : any) {
        return res.status(404).json({
            message : "Error inputing otp",
            data : error.message
        })
    }
}

export const verify = async(req : Request, res : Response ) =>{
    try {
        const {token} = req.params

        const userID : any = jwt.verify(token, "secret", (err, payload : any)=>{
            if(err){
                return err
            }else{
                return payload.id
            }
        })

        const user = await authModel.findById(userID)
        
        if (user) {
            if(user?.secret === true){

                const user = await authModel.findByIdAndUpdate(userID, {verified : true, token : ""}, {new : true})
                
                return res.status(201).json({
                message : "you can now log in",
                data : user
            })
    
            }else{
                return res.status(404).json({
                    message : "input otp",
                })
            }
        } else {
            return res.status(404).json({
                message : "user doesnt exist",
            })
        }

       

    } catch (error  : any) {
        return res.status(404).json({
            message : "Error verifying users",
            data : error.message
        })
    }
}

export const signIn = async(req : Request, res : Response ) =>{
    try {
        const {email, password} = req.body

        const user = await authModel.findOne({email})

        const token = jwt.sign({id : user?._id}, "secret")
        
        
        if (user) {
            const check = await bcrypt.compare(password, user?.password)
            if(check){

                if (user?.verified === true && user?.token === "") {
                    return res.status(201).json({
                message : `welcome ${user?.name}`,
                data : token
            })
                } else {
                    return res.status(404).json({
                        message : "not verifed",
                    })
                }
                
    
            }else{
                return res.status(404).json({
                    message : "incorrect password",
                })
            }
        } else {
            return res.status(404).json({
                message : "user doesnt exist",
            })
        }

       

    } catch (error  : any) {
        return res.status(404).json({
            message : "Error signing in",
            data : error.message
        })
    }
}