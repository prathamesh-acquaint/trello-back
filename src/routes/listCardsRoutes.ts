import express from 'express';
import {
  createCard,
  getAllCardsByBoard,
  getCardsByList,
  updateCard,
} from '../controllers/listCardController';

const router = express.Router();

router.get('/byList/:listId', getCardsByList);
router.get('/byBoard/:boardId', getAllCardsByBoard);
router.post('/create', createCard);
router.put('/update/:cardId', updateCard);

export default router;
