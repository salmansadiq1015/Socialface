import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["Image", "Video"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "20h",
    },
  },
  { timestamps: true }
);

storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 72000 });
export default mongoose.model("stories", storySchema);
