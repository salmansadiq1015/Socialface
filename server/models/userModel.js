import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    profilePicture: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvts5aHBstDkR8PigS4RmZkbZy78zpZoSuOw&s",
    },
    coverPhoto: {
      type: String,
      default:
        "https://img.freepik.com/free-photo/abstract-colorful-splash-3d-background-generative-ai-background_60438-2521.jpg",
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    about: {
      work: {
        type: String,
        default: "",
        trim: true,
      },
      education: {
        type: String,
        default: "",
        trim: true,
      },
      liveIn: {
        type: String,
        default: "",
        trim: true,
      },
      relationshipStatus: {
        type: String,
        default: "",
        trim: true,
      },
      phoneNumber: {
        type: String,
        default: "",
        trim: true,
      },
    },

    photos: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          default: "",
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    videos: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          default: "",
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reels: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          default: "",
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    stories: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          default: "",
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    marketPlace: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "marketPlace",
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    friends: [],
    lockProfile: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
