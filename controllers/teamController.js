const Team = require("../models/Team");
const User = require("../models/User");


// 🔹 Create Team (Creator becomes Admin)
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    const team = await Team.create({
      name,
      description,
      createdBy: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "admin"
        }
      ]
    });

    const populatedTeam = await Team.findById(team._id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    return res.status(201).json(populatedTeam);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// 🔹 Add Member (Admin Only)
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    // 🔎 DEBUG LOGS
    console.log("Incoming teamId:", req.params.teamId);
    console.log("All params:", req.params);
    console.log("Database name:", Team.db.name);

    const allTeams = await Team.find({});
    console.log("All teams in DB:", allTeams.map(t => t._id));

    const team = await Team.findById(req.params.teamId);
    console.log("Team found:", team ? team._id : null);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // 🔐 Check if current user is admin
    const currentMember = team.members.find(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!currentMember || currentMember.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    // 🔎 Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 Check if already member
    const alreadyMember = team.members.find(
      m => m.user.toString() === userId
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User already a member" });
    }

    // ➕ Add member
    team.members.push({
      user: userId,
      role: "member"
    });

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    return res.json(updatedTeam);

  } catch (error) {
    console.error("Add Member Error:", error);
    return res.status(500).json({ message: error.message });
  }
};



// 🔹 Get My Teams
exports.getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      "members.user": req.user._id
    })
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    return res.json(teams);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// 🔹 Remove Member (Admin Only)
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const currentMember = team.members.find(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!currentMember || currentMember.role !== "admin") {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    team.members = team.members.filter(
      m => m.user.toString() !== userId
    );

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    return res.json(updatedTeam);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};