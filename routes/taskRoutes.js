const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const {
  createTask,
  getMyTasks,
  getAssignedTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

router.post("/", protect, createTask);
router.get("/", protect, getMyTasks);
router.get("/assigned", protect, getAssignedTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;