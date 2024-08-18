import express from "express";
import { getAllStories, postStory } from "../controllers/storiesController.js";

const router = express.Router();

// Post Story
router.post("/create/story", postStory);

// Get Stories
router.get("/get/stories", getAllStories);

export default router;
