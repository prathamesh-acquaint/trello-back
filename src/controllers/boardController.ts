import { Request, Response, NextFunction } from 'express';
import Board from '../models/Board';

// @desc    Create a new board
// @route   POST /api/board/create
// @access  Private
export const createBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.body;
    const { user } = req;

    if (user?._id) {
      // Create Board
      const board = await Board.create({
        title,
        createdBy: user._id,
      });

      if (board) {
        res.status(201).json({
          _id: board._id,
          title: board.title,
          message: 'Board created successfully',
        });
      } else {
        res.status(400);
        throw new Error('Invalid board data.');
      }
    } else {
      res.status(401);
      throw new Error('Unauthorized Route.');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    List of all boards user wise
// @route   GET /api/board/list
// @access  Private
export const getBoards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const boards = await Board.find({ createdBy: user?._id });
    if (boards) {
      res.status(200).json({ data: boards });
    } else {
      res.status(400);
      throw new Error('Error fetching boards.');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update specific board
// @route   PUT /api/board/update/:id
// @access  Private
export const updateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const boardId = req.params?.id;
    const { title } = req.body;
    const { user } = req;
    if (boardId && title) {
      const updatedBoard = await Board.findOneAndUpdate(
        { _id: "boardId", createdBy: user?._id },
        { title },
        {new: true}
      );
      
      if (updatedBoard) {
        res.status(201).json({
          data: updateBoard,
          message: 'Board updated successfully',
        });
      } else {
        res.status(400);
        throw new Error('Error updating the board.');
      }
    } else {
      res.status(400);
      throw new Error('BoardId or Title id invalid.');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete specific board
// @route   DELETE /api/board/delete/:id
// @access  Private
export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const boardId = req.params?.id;
    const { user } = req;
    if (boardId) {
      const board = await Board.findOneAndDelete({
        _id: boardId,
        createdBy: user?._id,
      });
      if (board) {
        res.status(200).json({
          message: 'Board deleted successfully.',
        });
      } else {
        res.status(400);
        throw new Error('Invalid boardId mentioned.');
      }
    } else {
      res.status(400);
      throw new Error('BoardId is not Present.');
    }
  } catch (error) {
    next(error);
  }
};
