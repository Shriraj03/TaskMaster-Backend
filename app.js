const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter);

app.get("/", (req, res) => {
  res.send("TaskMaster API Running...");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/attachments", require("./routes/attachmentRoutes"));

app.use(errorHandler);

module.exports = app;