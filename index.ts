import express, { Application } from "express";
import db from "./config/db";
import { mainApp } from "./mainApp";
import dotenv from "dotenv"
dotenv.config()

const app : Application = express()
const port = parseInt(process.env.PORT!)

mainApp(app)
const server = app.listen(process.env.PORT || port, ()=>{
    db()
})

process.on("uncaughtException", (err : any) =>{
    console.log("server is shutting down for due to uncaughtException", err);
    
    process.exit(1)
})

process.on("unhandledRejection", (reason : any) =>{
    console.log("server is shutting down for due to unhandledRejection", reason);
    
    server.close(()=>{
        process.exit(1)
    })
})