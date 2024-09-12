import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    friends: [Object],
  },
  { timestamps: true }
);

export default mongoose.model("Friends", friendSchema);
