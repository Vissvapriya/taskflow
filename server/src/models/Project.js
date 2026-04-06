import mongoose from 'mongoose';

// TODO: Implement Project schema with the following fields:
// - title (String, required)
// - description (String, optional)
// - teamMembers (Array of User IDs)
// - status (String: 'Not Started', 'In Progress', 'Completed', default: 'Not Started')
// - deadline (Date, optional)
// - owner (User ID, required)
// - tasks (Array of Task IDs)
// - createdAt (Date, auto)
// - updatedAt (Date, auto)

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started'
    },
    deadline: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
