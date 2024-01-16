import {NextFunction, Request, Response} from "express";
import {hash, compare} from "bcrypt"
import 'dotenv/config';
import mongoose from "mongoose";
import usersSchema, {IUser} from "../models/user";
import jwt from 'jsonwebtoken';

const Auth = mongoose.model('user',usersSchema);
 const signup = async (req: Request, res: Response) =>{
    console.log(req.body);
    const { login, password } = req.body;
    console.log('login' ,login)
    try{
        const passwordHash = await hash(password, 10)
        const userData = {
            login: login,
            password: passwordHash,
        }
        const newUser = new Auth(userData);
        const userSaved = await newUser.save();
        const jwtOptions = {
            expiresIn: '24h',
        };

        const authToken = jwt.sign(userData, process.env.AUTH_TOKEN_KEY!, jwtOptions);
        return res.status(200).json({
            success: true,
            user:{
                user_id: newUser.id,
                login: login,
                password: password,
                authToken: authToken,
            }
        })
}catch(error){
        console.error(error);
        return res.status(500).json({ error: ` Internal Error` });
    }
 }

const login = async (req: Request, res: Response) =>{
    console.log(req.body);
    try{
        if(req.body){

        const user = await Auth.findOne({login: req.body.login})
       console.log('user :', user);
        if(user === null){
            return res.status(401).json({ message: 'Paire identifiant / mot de passe incorrect' });
        }else{
            const passwordCorrect = await compare(req.body.password, user.password);
            if(passwordCorrect){
                const jwtOptions = {
                    expiresIn: '24h',
                };
                const authToken = jwt.sign(user.toObject(), process.env.AUTH_TOKEN_KEY!, jwtOptions);
                return res.status(200).json({
                    success: true,
                    jwtToken: authToken,
                });
            }else{
                return res.status(400).json({error: 'Invalid Credentials'});
            }
        }
        }else{
            return res.status(400).json({error: 'body is empty'});
        }
    }catch (error){
        console.error(error);
        return res.status(500).json({ error: `Server Error` });
    }
}

const controller = {
    signup,
    login,
}

export default controller;