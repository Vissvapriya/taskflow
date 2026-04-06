import Team from '../models/Team.js';
import User from '../models/User.js';

// Get all teams for current user (owner or member)
export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('projects', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Teams fetched successfully',
      count: teams.length,
      teams
    });
  } catch (error) {
    next(error);
  }
};

// Get single team by ID
export const getTeamById = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('projects', 'title');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner or member
    const isOwner = team.owner._id.toString() === req.user.id;
    const isMember = team.members.some(m => m._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'You do not have access to this team' });
    }

    res.status(200).json({
      message: 'Team fetched successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

// Create new team
export const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: 'Team name must be at least 3 characters' });
    }

    // Create team with current user as owner
    const team = new Team({
      name,
      description: description || '',
      owner: req.user.id,
      members: [req.user.id], // Owner is automatically a member
      projects: []
    });

    await team.save();

    // Populate before returning
    await team.populate('owner', 'name email');
    await team.populate('members', 'name email');

    res.status(201).json({
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

// Update team
export const updateTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { name, description } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Only owner can update
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only team owner can update team' });
    }

    // Update fields
    if (name && name.trim().length >= 3) {
      team.name = name;
    }
    if (description !== undefined) {
      team.description = description;
    }

    await team.save();

    await team.populate('owner', 'name email');
    await team.populate('members', 'name email');
    await team.populate('projects', 'title');

    res.status(200).json({
      message: 'Team updated successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

// Delete team
export const deleteTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Only owner can delete
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only team owner can delete team' });
    }

    await Team.findByIdAndDelete(teamId);

    res.status(200).json({
      message: 'Team deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add member to team
export const addMember = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Only owner can add members
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only team owner can add members' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a member
    if (team.members.some(m => m.toString() === userId)) {
      return res.status(400).json({ error: 'User is already a team member' });
    }

    // Add member
    team.members.push(userId);
    await team.save();

    await team.populate('owner', 'name email');
    await team.populate('members', 'name email');
    await team.populate('projects', 'title');

    res.status(200).json({
      message: 'Member added successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

// Remove member from team
export const removeMember = async (req, res, next) => {
  try {
    const { teamId, memberId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Only owner can remove members
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only team owner can remove members' });
    }

    // Prevent removing owner
    if (team.owner.toString() === memberId) {
      return res.status(400).json({ error: 'Cannot remove team owner' });
    }

    // Remove member
    team.members = team.members.filter(m => m.toString() !== memberId);
    await team.save();

    await team.populate('owner', 'name email');
    await team.populate('members', 'name email');
    await team.populate('projects', 'title');

    res.status(200).json({
      message: 'Member removed successfully',
      team
    });
  } catch (error) {
    next(error);
  }
};

