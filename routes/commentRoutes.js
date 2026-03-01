const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  addComment,
  getTaskComments
} = require("../controllers/commentController");

router.post("/:taskId", protect, addComment);
router.get("/:taskId", protect, getTaskComments);

module.exports = router;