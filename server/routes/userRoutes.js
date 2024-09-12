import express from "express";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  deleteUser,
  editRole,
  followUser,
  getAllUsers,
  getContactList,
  getSingleUser,
  lockProfile,
  loginUser,
  registerUser,
  resetPassword,
  sendFriendRequest,
  unfollowUser,
  updateCoverImage,
  updatePassword,
  updateProfile,
  updateProfileImage,
  uploadFile,
  uploadImage,
  verificationUser,
} from "../controllers/userController.js";
import uploadMiddleware from "../middlewares/fileUpload.js";
import { requireSignIn } from "../middlewares/authMiddelware.js";

const router = express.Router();

// Register_User
router.post("/register_user", uploadMiddleware, registerUser);

// Upload Avatar
router.post("/upload/avatar", uploadMiddleware, uploadImage);

// Verification Email
router.post("/email_verification", verificationUser);

// Login user
router.post("/login_user", loginUser);

// Update Profile
router.patch("/update/userProfile/:id", updateProfile);

// Update Role
router.put("/update_role/:id", editRole);

// Profile Lock
router.put("/profile_lock/:id", lockProfile);

// Send Reset Password
router.post("/reset/password", resetPassword);

// Update Password
router.put("/update/password", updatePassword);

// Update Profile Image
router.put("/update/profileImage/:id", uploadMiddleware, updateProfileImage);

// Update Cover
router.put("/update/coverImage/:id", uploadMiddleware, updateCoverImage);

// Get ALl User
router.get("/all/users", getAllUsers);

// Get Single User
router.get("/user/info/:id", getSingleUser);

// Delete User info
router.delete("/delete/users/:id", deleteUser);

// Upload file
router.post("/upload/file", uploadMiddleware, uploadFile);

// Get All Contacts with required Data
router.get("/all/contactlist", getContactList);

// Follow User
router.put("/follow/user/:id", requireSignIn, followUser);

// Unfollow User
router.put("/unfollow/user/:id", requireSignIn, unfollowUser);

// Send Friend Request
router.put("/frient/request/:id", requireSignIn, sendFriendRequest);

// Accept Friend Request
router.put("/accept/friend/request/:id", requireSignIn, acceptFriendRequest);

// Cancel Friend Request
router.put("/cancel/friend/request/:id", requireSignIn, cancelFriendRequest);

export default router;
