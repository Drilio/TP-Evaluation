import {Schema} from 'mongoose';


export interface IGame{
    _id:string,
    joueur1: string,
    joueur2:  string,
    winner:  string,
    bestTime: Number,
    objective: Number,
}

const gamesSchema = new Schema<IGame>({
    joueur1: {type: String},
    joueur2: {type: String},
    winner: {type: String},
    bestTime: {type: Number},
    objective: {type: Number},
})

export default  gamesSchema