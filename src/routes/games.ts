import express from 'express';
import gamesCtrl from '../controllers/games';
const router = express.Router();

router.get('', gamesCtrl.GetAllGames);
router.get('/:id', gamesCtrl.GetOneGame)
router.post('', gamesCtrl.CreateGame);
router.put('/:id', gamesCtrl.ModifyGame);
router.delete('/:id', gamesCtrl.DeleteGame);

export default router