import express, {Router} from 'express';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import gamesRoutes from './routes/games';
import mongoose from "mongoose";
import 'dotenv/config';
import cors from 'cors';
import { Server } from "socket.io";
import {createServer} from "node:http";

const app = express();
// @ts-ignore
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée !', error));

const server = createServer(app)

const io = new Server(server)

let gameStarted = false
let objectif = 5000
let player = 0
io.on('connection', (socket)=>{
  console.log('let\'s go !!!!')
  socket.on('ready',()=>{
    gameStarted = true;
    player ++
    console.log(player)
    if(player == 2){
      console.log('game-start send')
    io.emit('game-start',objectif);
    }
  })
})

app.use(express.json());
app.use(cors());

const apiRouter = Router()

apiRouter.use('/auth', authRoutes)
apiRouter.use('/users', userRoutes)
apiRouter.use('/games', gamesRoutes)
app.use('', apiRouter)



server.listen(3012, () => {
  console.log('Server is listening on port 3012');
});

