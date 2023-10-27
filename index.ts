import express, { Application } from "express";
import db from "./config/db";
import { mainApp } from "./mainApp";

const app : Application = express()
const port  : number = 5689

mainApp(app)
const server = app.listen(port, ()=>{
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