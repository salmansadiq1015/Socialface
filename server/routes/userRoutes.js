import express from "express";
import {
  deleteUser,
  editRole,
  getAllUsers,
  getSingleUser,
  lockProfile,
  loginUser,
  registerUser,
  resetPassword,
  updateCoverImage,
  updatePassword,
  updateProfile,
  updateProfileImage,
  uploadFile,
  uploadImage,
  verificationUser,
} from "../controllers/userController.js";
import uploadMiddleware from "../middlewares/fileUpload.js";

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
export default router;
