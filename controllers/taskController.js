const Task = require("../models/Task");
const User = require("../models/User");
const Team = require("../models/Team");



// 🔹 Create Task (Auto-assign to creator if not provided)

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      createdBy: req.user._id,
      assignedTo: assignedTo || req.user._id
    });

    //  SOCKET NOTIFICATION
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    if (task.assignedTo && onlineUsers[task.assignedTo]) {
      io.to(onlineUsers[task.assignedTo]).emit("notification", {
        message: "You have been assigned a new task",
        taskId: task._id
      });
    }

    return res.status(201).json(task);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 🔹 Get My Tasks (Created by me)
exports.getMyTasks = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 5 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const tasks = await Task.find(query, search ? { score: { $meta: "textScore" } } : {})
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort(
        search
          ? { score: { $meta: "textScore" } }
          : { createdAt: -1 }
      )
      .skip(skip)
      .limit(limitNumber);

    const total = await Task.countDocuments(query);

    return res.json({
      success: true,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      data: tasks
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Tasks Assigned To Me
exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.json(tasks);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// 🔹 Update Task (Only creator can edit & reassign)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ownership check
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.dueDate = req.body.dueDate || task.dueDate;

    // If reassigned
    if (req.body.assignedTo) {
      task.assignedTo = req.body.assignedTo;
    }

    await task.save();

    // 🔔 SOCKET NOTIFICATION (Reassignment)
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    if (task.assignedTo && onlineUsers[task.assignedTo]) {
      io.to(onlineUsers[task.assignedTo]).emit("notification", {
        message: "A task has been assigned to you",
        taskId: task._id
      });
    }

    return res.json(task);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// 🔹 Delete Task (Only creator)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    return res.json({ message: "Task deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};