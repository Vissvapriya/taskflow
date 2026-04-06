import mongoose from 'mongoose';

// TODO: Implement Task schema with the following fields:
// - title (String, required)
// - description (String, optional)
// - project (Project ID, required)
// - assignedTo (User ID, optional)
// - status (String: 'To Do', 'In Progress', 'Done', default: 'To Do')
// - priority (String: 'Low', 'Medium', 'High', default: 'Medium')
// - dueDate (Date, optional)
// - comments (Array of comment objects)
// - createdBy (User ID, required)
// - createdAt (Date, auto)
// - updatedAt (Date, auto)

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done'],
      default: 'To Do'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    dueDate: { type: Date },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
