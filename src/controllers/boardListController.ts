import { Request, Response, NextFunction } from 'express';
import BoardList from '../models/BoardList';
import Board from '../models/Board';
import { validationResult } from 'express-validator';
import createError from 'http-errors';
import mongoose from 'mongoose';

// @desc    Create Board List
// @route   POST /api/boardList/create
// @access  Private
export const createBoardList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, boardId } = req.body;
    const { user } = req;

    // Validate if boardId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return next(createError(400, 'Invalid boardId format.'));
    }

    // Check if the board exists and the user has access
    const board = await Board.findOne({
      _id: boardId,
      createdBy: user?._id,
    }).select('_id');
    if (!board) {
      return next(createError(400, 'Invalid boardId or user not authorized'));
    }

    // Create the board list
    const list = await BoardList.create({
      title,
      boardId,
    });

    // Return the created list
    return res.status(201).json({
      message: 'List created successfully',
      _id: list._id,
      title: list.title,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get board list User and Board specific
// @route   GET /api/boardList/list/:boardId
// @access  Private
export const getBoardLists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boardId } = req.params;
    const { user } = req;

    // Validate if boardId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return next(createError(400, 'Invalid boardId format.'));
    }

    // Get the board.
    const board = await Board.findOne({ _id: boardId, createdBy: user?._id });
    if (!board) {
      return next(createError(400, 'Invalid boardId.'));
    }

    const lists = await BoardList.find({ boardId });
    res.status(200).json({board , data: lists});
  } catch (error) {
    next(error);
  }
};

// @desc    Update Board List
// @route   PUT /api/boardList/update/:listId
// @access  Private
export const updateBoardList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const { user } = req;
    const { title, boardId } = req.body;

    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate if listId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return next(createError(400, 'Invalid listId format.'));
    }

    // Verify if the List belongs to the user.
    const board = await Board.findOne({ _id: boardId, createdBy: user?._id });
    if (!board) {
      return next(createError(400, 'Invalid boardId.'));
    }

    // Update list.
    const updatedList = await BoardList.findOneAndUpdate(
      { _id: listId },
      { title },
      { new: true }
    );
    if (!updatedList) {
      return next(createError(400, 'Error updating list'));
    }

    res.status(201).json({
      list: updatedList,
      message: 'List updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Board List
// @route   PUT /api/boardList/update/:listId
// @access  Private
export const deleteBoardList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const { user } = req;
    const { boardId } = req.body;

    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate if listId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return next(createError(400, 'Invalid listId format.'));
    }

    // Verify if the List belongs to the user.
    const board = await Board.findOne({ _id: boardId, createdBy: user?._id });
    if (!board) {
      return next(createError(400, 'Invalid boardId.'));
    }

    // delete list.
    const list = await BoardList.findOneAndDelete({ _id: listId });
    if (!list) {
      return next(createError(400, 'Error updating list'));
    }

    res.status(200).json({
      message: 'List deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
