import mongoose from 'mongoose';

// TODO: Implement Team schema with the following fields:
// - name (String, required)
// - description (String, optional)
// - members (Array of User IDs)
// - owner (User ID, required)
// - projects (Array of Project IDs)
// - createdAt (Date, auto)
// - updatedAt (Date, auto)

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);

const Team = mongoose.model('Team', teamSchema);

export default Team;
