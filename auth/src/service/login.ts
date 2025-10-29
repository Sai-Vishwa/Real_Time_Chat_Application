
import { Request , Response } from "express";
import { connectMaster } from "../connector/connection.js";

interface requestType {
    email : string;
    password : string;
}

interface passwordType {
    password : string;
}

async function login(req : Request & {body : requestType}, res: Response) {
    try{
            const  email = req.body.email;
            const password = req.body.password;
            const connectionMaster = await connectMaster();
            const [sysPassword] = await connectionMaster.query(`SELECT password FROM users WHERE email = ?`, [email]);
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
            res.status(200).json({
                status: "success",
                message :"Login successful"
            });
            return;
    }
    catch(err: unknown){
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