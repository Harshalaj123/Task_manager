import { Schema, model, Document } from 'mongoose';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface ISubtask {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface ITask extends Document {
  user: Schema.Types.ObjectId;
  assignedTo?: Schema.Types.ObjectId | null;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  tags: string[];
  subtasks: ISubtask[];
  dueDate?: Date | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubtaskSchema = new Schema<ISubtask>({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
});

const TaskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    subtasks: [SubtaskSchema],
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for query performance
TaskSchema.index({ user: 1, status: 1, priority: 1, dueDate: 1 });

TaskSchema.pre('save', function (next) {
  if (this.isModified('isCompleted')) {
    if (this.isCompleted && this.status !== 'completed') {
      this.status = 'completed';
    } else if (!this.isCompleted && this.status === 'completed') {
      this.status = 'pending';
    }
  } else if (this.isModified('status')) {
    this.isCompleted = this.status === 'completed';
  }
  next();
});

export default model<ITask>('Task', TaskSchema);