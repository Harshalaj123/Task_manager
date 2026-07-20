import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: Date;
}

const TaskSchema = new Schema<ITask>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

export default model<ITask>('Task', TaskSchema);