import express from 'express';
import userCtrl from '../controllers/auth';
const router = express.Router();


router.post('/add', userCtrl.signup);
router.post('/connect', userCtrl.login);
export default router