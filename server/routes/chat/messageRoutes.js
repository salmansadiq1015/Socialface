import express from "express";
import { requireSignIn } from "../../middlewares/authMiddelware.js";
import {
  getMessages,
  postMessage,
} from "../../controllers/Chat/messageController.js";

const router = express.Router();

// Post Message
router.post("/create/message", requireSignIn, postMessage);

// Get Messages
router.get("/fetch/messages/:id", getMessages);

export default router;
