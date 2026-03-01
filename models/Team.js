const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member"
        }
      }
    ]
  },
  { timestamps: true }
);
teamSchema.index({ "members.user": 1 });
teamSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Team", teamSchema);