import {Schema} from 'mongoose';


export interface IUser{
    _id:string,
    password: string,
    login: string,
}

const usersSchema = new Schema<IUser>({
    password: {type: String},
    login: {type: String}
})

export default  usersSchema