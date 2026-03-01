const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadAttachment } = require("../controllers/attachmentController");

router.post("/:taskId", protect, upload.single("file"), uploadAttachment);

module.exports = router;