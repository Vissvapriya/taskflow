import Project from '../models/Project.js';
import User from '../models/User.js';

// Get all projects (user owns or is member of)
export const getAllProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Find projects where user is owner or team member
    const projects = await Project.find({
      $or: [
        { owner: userId },
        { teamMembers: userId }
      ]
    })
    .populate('owner', 'name email')
    .populate('teamMembers', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Projects fetched successfully',
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// Create new project
export const createProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, deadline, status } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({ error: 'Project title must be at least 3 characters' });
    }

    // Create project
    const newProject = new Project({
      title,
      description: description || '',
      deadline: deadline || null,
      status: status || 'Not Started',
      owner: userId,
      teamMembers: [userId]
    });

    await newProject.save();
    await newProject.populate('owner', 'name email');
    await newProject.populate('teamMembers', 'name email');

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    next(error);
  }
};

// Get project by ID
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id)
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is owner or team member
    const isOwner = project.owner._id.toString() === userId;
    const isMember = project.teamMembers.some(member => member._id.toString() === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'You do not have access to this project' });
    }

    res.status(200).json({
      message: 'Project fetched successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

// Update project
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, deadline, status } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is owner or team member
    const isOwner = project.owner.toString() === userId;
    const isMember = project.teamMembers.some(member => member.toString() === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'You do not have permission to update this project' });
    }

    // Update fields
    if (title) {
      if (title.trim().length < 3) {
        return res.status(400).json({ error: 'Project title must be at least 3 characters' });
      }
      project.title = title;
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (deadline !== undefined) {
      project.deadline = deadline;
    }

    if (status && ['Not Started', 'In Progress', 'Completed'].includes(status)) {
      project.status = status;
    }

    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('teamMembers', 'name email');

    res.status(200).json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

// Delete project
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner can delete
    if (project.owner.toString() !== userId) {
      return res.status(403).json({ error: 'Only project owner can delete this project' });
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add member to project
export const addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ error: 'Member ID is required' });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner can add members
    if (project.owner.toString() !== userId) {
      return res.status(403).json({ error: 'Only project owner can add members' });
    }

    // Check if user exists
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a member
    if (project.teamMembers.includes(memberId)) {
      return res.status(400).json({ error: 'User is already a project member' });
    }

    project.teamMembers.push(memberId);
    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('teamMembers', 'name email');

    res.status(200).json({
      message: 'Member added successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

// Remove member from project
export const removeMember = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only owner can remove members
    if (project.owner.toString() !== userId) {
      return res.status(403).json({ error: 'Only project owner can remove members' });
    }

    // Cannot remove owner
    if (project.owner.toString() === memberId) {
      return res.status(400).json({ error: 'Cannot remove project owner' });
    }

    project.teamMembers = project.teamMembers.filter(member => member.toString() !== memberId);
    await project.save();
    await project.populate('owner', 'name email');
    await project.populate('teamMembers', 'name email');

    res.status(200).json({
      message: 'Member removed successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};
