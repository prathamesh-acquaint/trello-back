import express from 'express';
import {
  createBoard,
  deleteBoard,
  getBoards,
  updateBoard,
} from '../controllers/boardController';

const router = express.Router();

router.post('/create', createBoard);
router.get('/list', getBoards);
router.put('/update/:id', updateBoard);
router.delete('/delete/:id', deleteBoard);

export default router;
