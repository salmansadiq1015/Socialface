import express from "express";
import {
  createComment,
  createCommentReply,
  createPost,
  deletePost,
  getAllPost,
  getSinglePost,
  likeComment,
  likePost,
  singlePostComment,
  unLikeComment,
  unLikePost,
  updatePost,
} from "../controllers/postController.js";
import { requireSignIn } from "../middlewares/authMiddelware.js";

const router = express.Router();

// Post Story
router.post("/create/post", requireSignIn, createPost);

// Get Stories (/get/posts?page=1&limit=10)
router.get("/get/posts", getAllPost);

// Like Post
router.put("/like/post/:id", requireSignIn, likePost);

// UnLike Post
router.put("/unlike/post/:id", requireSignIn, unLikePost);

// Add Comment
router.put("/add/comment", requireSignIn, createComment);

// Add Comment Reply
router.put("/add/comment/reply", requireSignIn, createCommentReply);

// Get Single Post Comments
router.get("/post/comments/:id", requireSignIn, singlePostComment);

// Like Comment
router.put("/like/comment", requireSignIn, likeComment);

// unlike Comment
router.put("/unlike/comment", requireSignIn, unLikeComment);

// Get Single Post
router.get("/single/post/:id", getSinglePost);

// Update Post
router.put("/update/post/:id", requireSignIn, updatePost);

// Delete Post
router.delete("/delete/post/:id", requireSignIn, deletePost);

export default router;
