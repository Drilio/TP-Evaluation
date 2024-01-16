import {NextFunction, Request, Response} from "express";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import gamesSchema, {IGame} from "../models/game";
import usersSchema, {IUser} from "../models/user";
const Game = mongoose.model('game',gamesSchema);
const User = mongoose.model('user', usersSchema)


const CreateGame = async (req: Request<{}, {}, { data: IGame}>, res: Response) => {
    console.log(req.body);
    try {
        try {
            const authorization = req.headers.authorization!.split(' ')[1];
            const decoded = jwt.verify(authorization, process.env.AUTH_TOKEN_KEY!) as IUser
            console.log(decoded)
            const userLogin = decoded.login
            const user = await User.findOne({login: userLogin});
            if (user == null) {
                res.status(401).json({message: 'Incorrect Token'});
            } else {
                console.log('body creation de jeu',req.body.data)
                const newGame = new Game(req.body.data)
                console.log('newGAme',newGame)
                const gameSaved = await newGame.save()
                res.status(200).json({gameSaved});
            }
        } catch (error) {
            console.log('error:', error)
            res.status(500).json({error});
        }
    } catch (error) {
        console.log('error:', error)
        res.status(500).json({error});
    }
}

const GetOneGame = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        const gameId = req.params.id
        console.log(gameId)
        const myGame = await Game.findById(gameId)
        // @ts-ignore
        res.json(myGame);
    }catch (error){
        console.log('error :', error)
        res.status(500).json({ error });
    }
}

const DeleteGame = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const gameId = req.params.id
        Game.findById(gameId)
        await Game.deleteOne({_id:gameId})
        console.log("Object deleted")
    }catch(error){
        console.log('error:', error);
        res.status(500).json({ error });
    }
}

const ModifyGame = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        console.log('test Modify Game')
        const gameObject = {
            ...req.body
        };
        Game.findByIdAndUpdate(
            req.params.id,
            {...gameObject}
        ).then(()=>{
            if (!gameObject) {
                return res.status(404).json({ message: 'Jeu non trouvé' });
            }
            console.log('Object successfully modified:', gameObject);
            res.status(200).json({ message: 'Objet modifié !', gameObject });
        })
    }catch (error){
        console.log('Error updating project:', error);
        res.status(500).json({ error });
    }
}


const GetAllGames = async (req:Request,res:Response,next:NextFunction) => {
    try{
        try{
            const authorization = req.headers.authorization!.split(' ')[1];
            const decoded = jwt.verify(authorization, process.env.AUTH_TOKEN_KEY!) as IUser
            const userLogin = decoded.login
            const user = await User.findOne({login: userLogin});
            if(user == null){
                res.status(401).json({ message: 'Incorrect Token' });
            }else{
                const allGames : IGame[] = await Game.find({});
                return await res.status(200).json({
                    success: true,
                    data: allGames
                });
            }

        }catch (error) {
            console.error(error);
            return res.status(500).json({ error: `Server Error` });
        }
    }catch(error){
        return res.status(500).json({error: 'Server Error'});
    }
}




const controller = {
    GetAllGames,
    CreateGame,
    GetOneGame,
    DeleteGame,
    ModifyGame
}

export default controller