import storiesModel from "../models/storiesModel.js";
import cron from "node-cron";

// Create Story
export const postStory = async (req, res) => {
  try {
    const { userId, userName, profileImage, mediaUrl, mediaType } = req.body;

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "User id is required!" });
    }
    if (!userName) {
      return res
        .status(400)
        .send({ success: false, message: "User name is required!" });
    }
    if (!profileImage) {
      return res
        .status(400)
        .send({ success: false, message: "Profile Image is required!" });
    }
    if (!mediaUrl) {
      return res
        .status(400)
        .send({ success: false, message: "Media file is required!" });
    }
    if (!mediaType) {
      return res
        .status(400)
        .send({ success: false, message: "Media type is required!" });
    }

    const story = await storiesModel.create({
      userId,
      userName,
      profileImage,
      mediaUrl,
      mediaType,
    });

    res.status(200).send({
      success: true,
      message: "Story posted!",
      story,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create story.",
      error: error,
    });
  }
};

// Get All Stories

export const getAllStories = async (req, res) => {
  try {
    const stories = await storiesModel.find({});

    res.status(200).send({
      success: true,
      message: "All stories.",
      stories: stories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all story .",
      error: error,
    });
  }
};

// Schedule the job to run every minute
cron.schedule("* * * * *", async () => {
  try {
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() - 20 * 60 * 60 * 1000
    );

    const result = await storiesModel.deleteMany({
      createdAt: { $lt: expirationDate },
    });
    console.log(`Deleted ${result.deletedCount} expired stories`);
  } catch (error) {
    console.error("Error during scheduled cleanup of stories:", error);
  }
});
