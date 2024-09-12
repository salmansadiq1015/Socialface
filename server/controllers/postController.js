import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  },
  region: "eu-north-1",
});

// Create Post
export const createPost = async (req, res) => {
  try {
    const { userId, userName, profileImage, content, mediaUrl, mediaType } =
      req.body;

    if (!userId) {
      return res.status(200).send({
        success: false,
        message: "User Id is required!",
      });
    }

    if (!mediaUrl || !content) {
      return res.status(200).send({
        success: false,
        message: "Content is required!",
      });
    }

    const post = await postModel.create({
      userId,
      userName,
      profileImage,
      content,
      mediaUrl,
      mediaType,
    });

    res.status(200).send({
      success: true,
      message: "Post Created!",
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create Post!",
      error,
    });
  }
};

// Get All Post
export const getAllPost = async (req, res) => {
  try {
    const posts = await postModel.find({}).sort({ createdAt: -1 }).lean();

    res.status(200).send({
      success: true,
      message: "All Posts",
      posts: posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Posts!",
      error,
    });
  }
};

// Like Post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId);

    if (!post || !user) {
      return res.status(400).send({
        success: false,
        message: "Post & User not found!",
      });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).send({
        success: false,
        message: "Post already liked!",
      });
    }

    post.likes.push(userId);
    user.likedPosts.push(postId);

    await post.save();
    await user.save();

    res.status(200).send({
      success: true,
      message: "Post liked successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in like Post!",
      error,
    });
  }
};

// UnLike Post
export const unLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId);

    if (!post || !user) {
      return res.status(400).send({
        success: false,
        message: "Post & User not found!",
      });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).send({
        success: false,
        message: "Post not liked yet!",
      });
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId);
    user.likedPosts = user.likedPosts.filter((id) => id.toString() !== postId);

    await post.save();
    await user.save();

    res.status(200).send({
      success: true,
      message: "Post unliked successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in like Post!",
      error,
    });
  }
};

// Add Comment
export const createComment = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    if (!comment) {
      return res.status(400).send({
        success: false,
        message: "Comment is required!",
      });
    }
    if (!postId) {
      return res.status(400).send({
        success: false,
        message: "Post id is required!",
      });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Post not found!",
      });
    }

    const newComment = {
      user: {
        _id: req.user.user._id,
        name: req.user.user.firstName + " " + req.user.user.lastName,
        profilePicture: req.user.user.profilePicture,
      },
      comment,
      commentReplies: [],
      likes: [],
    };

    post.comments.push(newComment);

    await post.save();

    // Create Notification
    res.status(200).send({
      success: true,
      message: "Comment added!",
      post: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in comment !",
      error,
    });
  }
};

// Add Comment Reply
export const createCommentReply = async (req, res) => {
  try {
    const { commentReply, postId, commentId } = req.body;
    if (!commentReply) {
      return res.status(400).send({
        success: false,
        message: "Comment reply is required!",
      });
    }
    if (!postId) {
      return res.status(400).send({
        success: false,
        message: "Post id is required!",
      });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Post not found!",
      });
    }

    const comment = post?.comments?.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return res.status(400).send({
        success: false,
        message: "Comment not found!",
      });
    }

    const commentData = {
      user: {
        _id: req.user.user._id,
        name: req.user.user.firstName + " " + req.user.user.lastName,
        profilePicture: req.user.user.profilePicture,
      },
      commentReply,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!comment.commentReplies) {
      comment.commentReplies = [];
    }

    comment.commentReplies?.push(commentData);

    await post.save();

    // Create Notification

    res.status(200).send({
      success: true,
      message: "Comment added!",
      post: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in comment reply!",
      error,
    });
  }
};

// Get Single Post Comments
export const singlePostComment = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).send({
        success: false,
        message: "Post Id is required",
      });
    }

    const comments = await postModel
      .findById({ _id: postId })
      .select("comments");
    res.status(200).send({
      success: true,
      comments: comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get single post comments!",
      error,
    });
  }
};

// Like Comment
export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Post not found!",
      });
    }
    const comment = post.comments.find((item) => item._id.equals(commentId));
    if (!comment) {
      return res.status(400).send({
        success: false,
        message: "Invalid comment id!",
      });
    }

    if (comment.likes.includes(req.user.id)) {
      return res.status(400).send({
        success: false,
        message: "Comment already liked!",
      });
    }

    comment.likes.push(req.user.id);
    await post.save();

    res.status(200).send({
      success: true,
      message: "Comment liked successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in like comment!",
      error: error,
    });
  }
};

// Unlike Comment
export const unLikeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Post not found!",
      });
    }
    const comment = post.comments.find((item) => item._id.equals(commentId));
    if (!comment) {
      return res.status(400).send({
        success: false,
        message: "Invalid comment id!",
      });
    }

    if (!comment.likes.includes(req.user.id)) {
      return res.status(400).send({
        success: false,
        message: "Post not liked yet!",
      });
    }

    comment.likes = comment.likes.filter((id) => id.toString() !== req.user.id);
    await post.save();

    res.status(200).send({
      success: true,
      message: "Comment unliked successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in unlike comment!",
      error: error,
    });
  }
};

// Get Single Post
export const getSinglePost = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({
        success: false,
        message: "Post id is required!",
      });
    }
    const post = await postModel.findById(id);

    // Update Views
    await postModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Single Post",
      post: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting single post!",
      error,
    });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userName, profileImage, content, mediaUrl, mediaType } = req.body;

    if (!mediaUrl || !content) {
      return res.status(200).send({
        success: false,
        message: "Content is required!",
      });
    }

    const post = await postModel.findById({ _id: postId });

    if (!post) {
      return res.status(200).send({
        success: false,
        message: "Post not found!",
      });
    }

    // Update From S3 Bucket
    if (mediaUrl && mediaUrl !== post.mediaUrl) {
      const oldMediaKey = post.mediaUrl.split("/").pop();

      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: oldMediaKey,
      };

      try {
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log("Old media deleted from S3 successfully");
      } catch (error) {
        console.error("Error deleting old media from S3:", error);
      }
    }

    const updatePost = await postModel.findByIdAndUpdate(
      { _id: post._id },
      {
        userName: userName,
        profileImage: profileImage,
        content: content,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
      },
      { new: true }
    );

    await updatePost.save();

    res.status(200).send({
      success: true,
      message: "Post Created!",
      updatePost: updatePost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create Post!",
      error,
    });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({
        success: false,
        message: "Post id is required!",
      });
    }

    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found!",
      });
    }

    const mediaUrl = post.mediaUrl;
    const mediaKey = mediaUrl.split("/").pop();

    // Delete the media from S3
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: mediaKey,
    };

    try {
      await s3.send(new DeleteObjectCommand(deleteParams));
      console.log("Media deleted from S3 successfully");
    } catch (error) {
      console.error("Error deleting media from S3:", error);
    }

    // Delete from DB
    await postModel.findByIdAndDelete({ _id: id });

    res.status(200).send({
      success: true,
      message: "Post delete successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete post!",
      error,
    });
  }
};
