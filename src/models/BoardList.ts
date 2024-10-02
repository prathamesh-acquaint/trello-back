import mongoose, { Document, Schema } from 'mongoose';
import { IBoard } from './Board';

export interface IBoardList extends Document {
  _id: string;
  title: string;
  boardId: IBoard['_id'];
  createdAt: Date;
}

const BoardListSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBoardList>('BoardList', BoardListSchema);
