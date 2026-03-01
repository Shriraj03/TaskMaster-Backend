const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createTeam,
  addMember,
  getMyTeams,
  removeMember
} = require("../controllers/teamController");

router.post("/", protect, createTeam);
router.get("/", protect, getMyTeams);
router.post("/:teamId/add-member", protect, addMember);
router.post("/:teamId/remove-member", protect, removeMember);

module.exports = router;