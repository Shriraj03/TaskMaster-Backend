const Attachment = require("../models/Attachment");
const Task = require("../models/Task");

exports.uploadAttachment = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const attachment = await Attachment.create({
      fileName: req.file.filename,
      filePath: req.file.path,
      task: taskId,
      uploadedBy: req.user._id
    });

    return res.status(201).json(attachment);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};