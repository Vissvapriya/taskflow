import mongoose from 'mongoose';

// TODO: Implement User schema with the following fields:
// - name (String, required)
// - email (String, required, unique)
// - password (String, required, hashed with bcrypt)
// - role (String: 'Admin', 'Manager', 'Member', default: 'Member')
// - teams (Array of Team IDs)
// - bio (String, optional)
// - profilePicture (String, optional)
// - createdAt (Date, auto)
// - updatedAt (Date, auto)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Member'],
      default: 'Member'
    },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    bio: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
