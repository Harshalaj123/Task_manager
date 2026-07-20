import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], 
    default: 'PENDING' 
  },
  priority: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'], 
    default: 'MEDIUM' 
  },
  dueDate: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Connects the task to a specific user
}, {
  timestamps: true
});

export const Task = model('Task', taskSchema);