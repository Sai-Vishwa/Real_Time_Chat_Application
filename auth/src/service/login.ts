
import { Request , Response } from "express";
import { stat } from "fs";
import { randomBytes } from "crypto";
import { connectMaster } from "../connector/connection.js";

interface requestType {
    username : string;
    password : string;
}

interface passwordType {
    password : string;
}

const generateSession = (): string => {
  return randomBytes(32).toString("hex"); 
};

async function login(req : Request & {body : requestType}, res: Response) {
    try{
            const  uname = req.body.username;
            const password = req.body.password;
            const connectionMaster = await connectMaster();
            const [sysPassword] = await connectionMaster.query(`SELECT password FROM users WHERE username = ?`, [uname]);
            const sysPwd : passwordType[] = sysPassword as passwordType[];
            console.log("System password fetched: ", sysPwd);
            if(sysPwd.length === 0){
                res.status(200).json({
                    status: "error",
                    message: "Invalid login"
                })
                return
            }
            if(sysPwd[0].password !==  password){
                res.status(200).json({
                    status: "error",
                    message: "Invalid login",
                })
                return
            }
            const session : string = generateSession();
            await connectionMaster.query(`INSERT INTO session (session , username) values (? , ?)`, [session , uname]);

            console.log("Login successful, session created: ", session);
            res.status(200).json({
                session: session,
                status: "success",
                message :"Login successful"
            });
            return;
    }
    catch(err: unknown){
        console.log("Login failed: ", err);
        let message = "An error occurred during login";
        if (err instanceof Error) {
            message = err.message;
        }
        res.status(200).json({
            status: "error",
            message: message
        });
        return;
    }
    
}

export default login;