const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    fileName: String,
    filePath: String,
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attachment", attachmentSchema);