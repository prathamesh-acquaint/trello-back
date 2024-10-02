import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import createError from 'http-errors';
import Board from '../models/Board';
import BoardList from '../models/BoardList';
import ListCard from '../models/ListCard';

// @desc    Create a new card
// @route   POST /api/card/create
// @access  Private
export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardTitle, listId, boardId } = req.body;
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

    // Check if the List is belongs to that Board.
    const List = await BoardList.findOne({ _id: listId, boardId }).select(
      '_id'
    );
    if (!List) {
      return next(
        createError(
          400,
          'Invalid listId or this List is not belongs to the provided card.'
        )
      );
    }

    // Create List Card.
    const Card = await ListCard.create({
      title: cardTitle,
      listId,
    });
    if (!Card) {
      return next(createError(400, 'Error creating Card.'));
    }
    return res.status(201).json({
      data: Card,
      message: 'Card created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Cards as per List
// @route   GET /api/card/byList/:listId
// @access  Private
export const getCardsByList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listId } = req.params;
    const { user } = req;

    // Validate if listId is a valid ObjectId.
    if (!mongoose.Types.ObjectId.isValid(listId)) {
      return next(createError(400, 'Invalid listId format.'));
    }

    // Get the List Object.
    const List = await BoardList.findById(listId);
    if (!List) {
      return next(createError(400, 'Invalid List Id.'));
    }

    // Check if valid User is creating the card or not.
    const BoardObj = await Board.findOne({
      createdBy: user?._id,
      _id: List.boardId,
    });
    if (!BoardObj) {
      return next(createError(400, 'The Board is not belonged to this user.'));
    }

    // Get List of cards.
    const CardsArr = await ListCard.find({ listId });
    if (!CardsArr) {
      return next(createError(500, 'Error fetching cards.'));
    }

    return res.status(200).json({
      message: 'Cards Fetched Successfully.',
      data: CardsArr,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Cards by Board
// @route   GET /api/card/byBoard/:boardId
// @access  Private
export const getAllCardsByBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boardId } = req.params;
    const { user } = req;

    // Validate if boardId is a valid ObjectId.
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return next(createError(400, 'Invalid boardId format.'));
    }

    // Get the Board based on User.
    const BoardObj = await Board.findOne({
      createdBy: user?._id,
      _id: boardId,
    });
    if (!BoardObj) {
      return next(createError(400, 'This board is authorized.'));
    }

    // Get all cards.
    const CardsArr = await ListCard.find();
    if (!CardsArr) {
      return next(createError(500, 'Error fetching Cards.'));
    }

    return res.status(200).json({
      message: 'Cards Fetched Successfully.',
      totalsCards: CardsArr.length,
      data: CardsArr,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit ListId in Card
// @route   PUT /api/card/update/:cardId
// @access  Private
export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const { listId, title } = req.body;
    // const {user} = req
    const payload = listId ? { listId } : { title };
    
    // Validate if cardId is a valid ObjectId.
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return next(createError(400, 'Invalid cardId format.'));
    }

    // Some more validations.

    // Get the card.
    const CardObj = await ListCard.findOneAndUpdate({ _id: cardId }, payload, {
      new: true,
    });
    if (!CardObj) {
      return next(createError(400, 'Error Updating Card.'));
    }

    // Return Updated Card.
    return res
      .status(200)
      .json({ message: 'Card updated successfully', data: CardObj });
  } catch (error) {
    next(error);
  }
};
