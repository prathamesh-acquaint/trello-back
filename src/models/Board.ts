import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IBoard extends Document {
  _id: string;
  title: string;
  createdBy: IUser['_id'];
  createdAt: Date;
}

const BoardSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBoard>('Board', BoardSchema);
