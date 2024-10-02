import mongoose, { Document, Schema } from 'mongoose';
import { IBoardList } from './BoardList';

export interface IListCard extends Document {
  _id: string;
  title: string;
  listId: IBoardList['_id'];
  createdAt: Date;
}

const ListCardSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    listId: {
      type: String,
      required: true,
      ref: 'BoardList',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IListCard>('ListCard', ListCardSchema);
