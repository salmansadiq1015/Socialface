import express from "express";
import { requireSignIn } from "../../middlewares/authMiddelware.js";
import {
  addUser,
  createChat,
  deleteChat,
  fetchChats,
  groupChat,
  removeUser,
  renameGroup,
} from "../../controllers/Chat/ChatController.js";

const router = express.Router();

// Create Chat
router.post("/create/chat", requireSignIn, createChat);

// Fetch Chat
router.get("/fetch/chat/:id", requireSignIn, fetchChats);

// Create Group Chat
router.post("/create/group/chat", requireSignIn, groupChat);

// Rename Group
router.put("/rename/group", requireSignIn, renameGroup);

// Remove User
router.put("/remove/user", requireSignIn, removeUser);

// Add User
router.put("/add/user", requireSignIn, addUser);

// Delete User
router.delete("/delete/user", requireSignIn, deleteChat);

export default router;
