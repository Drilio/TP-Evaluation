import express from 'express';
import userCtrl from '../controllers/user';
const router = express.Router();


router.get('/check-auth', userCtrl.isconnect);
router.get('/all', userCtrl.getAll )


export default router