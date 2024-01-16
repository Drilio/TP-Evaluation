import 'dotenv/config';
import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";
import {IUser} from "../models/user";

const auth = (req:Request, res:Response , next:NextFunction) => {
    try{
    const token = req.headers.authorization!.split(' ')[1];
    console.log(token)
        const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN_KEY!) as IUser
        const userId = decodedToken._id
        req.auth = {
        userId:userId
        }
        next();
    }catch(error){
        console.error('Authentication Error:', error);
        // @ts-ignore
        res.status(401).json({ error: "Invalid or expired token" });
    }
}


export default auth;

