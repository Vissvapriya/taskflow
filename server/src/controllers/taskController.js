import Task from '../models/Task.js';
import Project from '../models/Project.js';

// Get all tasks for a project
export const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // Verify user has access to this project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is owner or team member
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.teamMembers.some(m => m.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'You do not have access to this project' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Tasks fetched successfully',
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

// Get single task
export const getTaskById = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'title');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify access to the project
    const project = await Project.findById(task.project._id);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.teamMembers.some(m => m.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'You do not have access to this task' });
    }

    res.status(200).json({
      message: 'Task fetched successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// Create task
export const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;

    // Validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Task title must be at least 3 characters' });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify user is project member
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.teamMembers.some(m => m.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'You must be a project member to create tasks' });
    }

    // Create task
    const task = new Task({
      title,
      description: description || '',
      project: projectId,
      assignedTo: assignedTo || null,
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      createdBy: req.user.id,
      status: 'To Do'
    });

    await task.save();

    // Populate before returning
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// Update task
export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify access
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.teamMembers.some(m => m.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'You do not have access to update this task' });
    }

    // Update allowed fields
    if (title !== undefined && title.trim().length >= 3) {
      task.title = title;
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo || null;
    }
    if (priority !== undefined && ['Low', 'Medium', 'High'].includes(priority)) {
      task.priority = priority;
    }
    if (status !== undefined && ['To Do', 'In Progress', 'Done'].includes(status)) {
      task.status = status;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate || null;
    }

    await task.save();

    // Populate before returning
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify access
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.teamMembers.some(m => m.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'You do not have access to delete this task' });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update task status
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['To Do', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify access
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.teamMembers.some(m => m.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'You do not have access to update this task' });
    }

    task.status = status;
    await task.save();

    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(200).json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    next(error);
  }
};
