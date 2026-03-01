const Comment = require("../models/Comment");
const Task = require("../models/Task");

// ➕ Add Comment
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = await Comment.create({
      content,
      task: taskId,
      createdBy: req.user._id
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("createdBy", "name email");

    // 🔔 SOCKET NOTIFICATION (Comment on Task)
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    if (task.assignedTo && onlineUsers[task.assignedTo]) {
      io.to(onlineUsers[task.assignedTo]).emit("notification", {
        message: "New comment on your task",
        taskId: task._id
      });
    }

    return res.status(201).json(populatedComment);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 📄 Get Comments of Task
exports.getTaskComments = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const comments = await Comment.find({ task: taskId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.json(comments);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};