import express from "express"
import { createBoardList, deleteBoardList, getBoardLists, updateBoardList } from "../controllers/boardListController";

const router = express.Router();

router.post("/create" , createBoardList);
router.get('/list/:boardId' , getBoardLists);
router.put('/update/:listId' , updateBoardList);
router.delete('/delete/:listId' , deleteBoardList);

export default router