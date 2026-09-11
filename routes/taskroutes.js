const express = require('express');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Protected
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Protected
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: 'todo',
      creator: req.user._id,
      assignedTo: null,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (title, description, status)
// @access  Protected (owner or admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only creator or admin can update
    if (
      task.creator.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      if (!['todo', 'doing', 'done'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      task.status = status;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Protected (owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only creator or admin can delete
    if (
      task.creator.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status only (drag-and-drop)
// @access  Protected (owner, assignee, or admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Owner, assignee, or admin can change status
    const isOwner = task.creator.toString() === req.user._id.toString();
    const isAssignee =
      task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAssignee && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to change task status' });
    }

    const { status } = req.body;

    if (!status || !['todo', 'doing', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value. Must be: todo, doing, or done' });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error updating task status' });
  }
});

// @route   PATCH /api/tasks/:id/assign
// @desc    Assign or reassign a task
// @access  Protected
router.patch('/:id/assign', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { assignedTo } = req.body;

    if (req.user.role === 'admin') {
      // Admin can assign/reassign to anyone, or unassign (null)
      task.assignedTo = assignedTo || null;
    } else {
      // Normal user can only assign unassigned tasks to themselves
      if (task.assignedTo !== null && task.assignedTo !== undefined) {
        return res.status(403).json({
          message: 'This task is already assigned. Only admins can reassign tasks.',
        });
      }

      if (assignedTo !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'You can only assign tasks to yourself',
        });
      }

      task.assignedTo = req.user._id;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ message: 'Server error assigning task' });
  }
});

module.exports = router;
