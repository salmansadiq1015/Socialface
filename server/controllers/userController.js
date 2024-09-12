import {
  comparePassword,
  createRandomToken,
  hashPassword,
} from "../helper/encryption.js";
import sendMail from "../helper/mail.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, profilePicture } = req.body;

    if (!firstName) {
      return res.status(400).send({
        success: false,
        message: "First name is required!",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email  is required!",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required!",
      });
    }

    // Existing User

    const isExisting = await userModel.findOne({ email });

    if (isExisting) {
      return res.status(400).send({
        success: false,
        message: "Email already exist!",
      });
    }

    // User

    const user = {
      firstName,
      lastName,
      email,
      password,
      profilePicture,
    };

    const activationToken = await createActivationToken(user);
    const activationCode = activationToken.activationCode;

    // Send Email to User
    const data = {
      user: { name: user.firstName + user.lastName },
      activationCode,
    };

    await sendMail({
      email: user.email,
      subject: "Varification Email!",
      template: "activation_code.ejs",
      data,
    });

    res.status(200).send({
      success: true,
      message: `Please cheak your email: ${user.email} to activate your account`,
      activationToken: activationToken.token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error register user!",
      error: error,
    });
  }
};

// Upload files
export const uploadImage = async (req, res) => {
  try {
    const file = req.files;
    const imageUrl = file[0].location;

    res.status(200).send({
      success: true,
      message: "Profile Image or file!",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Upload file!",
      error: error,
    });
  }
};

// Create Activation Token
export const createActivationToken = async (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign({ user, activationCode }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  return { token, activationCode };
};

// Save User

export const verificationUser = async (req, res) => {
  try {
    const { activation_token, activation_code } = req.body;

    if (!activation_token) {
      return res.status(400).send({
        success: false,
        message: "Activation_token is required! ",
      });
    }
    if (!activation_code) {
      return res.status(400).send({
        success: false,
        message: "Activation_code is required! ",
      });
    }

    const newUser = await jwt.verify(activation_token, process.env.JWT_SECRET);
    if (newUser.activationCode !== activation_code) {
      return res.status({
        success: false,
        message: "Invalid activation code!",
      });
    }
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      gender,
      profilePicture,
    } = newUser.user;

    // Existing User

    const isExisting = await userModel.findOne({ email });

    if (isExisting) {
      return res.status(400).send({
        success: false,
        message: "Email already exist!",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      profilePicture,
    });

    res.status(200).send({
      success: true,
      message: "Register successfully!",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while register user after activation!",
    });
  }
};

// Login User Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email & Password in required!",
      });
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid email & password!",
      });
    }

    const isPassword = await comparePassword(password, user.password);
    if (!isPassword) {
      return res.status(400).send({
        success: false,
        message: "Invalid Password!",
      });
    }

    const token = await jwt.sign(
      { id: user._id, user: user },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "29d" : "1d" }
    );

    const { password: userPassword, ...userData } = user._doc;

    res.status(200).send({
      success: true,
      message: "Login successfully!",
      user: userData,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while login user!",
      error,
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      gender,
      profilePicture,
      coverPhoto,
      bio,
      website,
      location,
      about,
    } = req.body;

    const { work, education, liveIn, relationshipStatus, phoneNumber } = about;
    console.log(work, education, liveIn, relationshipStatus, phoneNumber);

    // Existing User

    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found!",
      });
    }

    const userData = await userModel.findByIdAndUpdate(
      { _id: user._id },
      {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        dateOfBirth: dateOfBirth || user.dateOfBirth,
        gender: gender || user.gender,
        profilePicture: profilePicture || user.profilePicture,
        coverPhoto: coverPhoto || user.coverPhoto,
        bio: bio || user.bio,
        website: website || user.website,
        location: location || user.location,
        "about.work": work || user.about.work,
        "about.education": education || user.about.education,
        "about.liveIn": liveIn || user.about.liveIn,
        "about.relationshipStatus":
          relationshipStatus || user.about.relationshipStatus,
        "about.phoneNumber": phoneNumber || user.about.phoneNumber,
      }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated!",
      userData: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error register user!",
      error: error,
    });
  }
};

// Update Role
export const editRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "User Id is required!",
      });
    }
    if (!role) {
      return res.status(400).send({
        success: false,
        message: "role is required!",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { role: role } },
      { new: true }
    );
    await user.save();

    res.status(200).send({
      success: true,
      message: "Role updated!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error register user!",
      error: error,
    });
  }
};

// lock Profile

export const lockProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { lockProfile } = req.body;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "User Id is required!",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { lockProfile: lockProfile } },
      { new: true }
    );
    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error register user!",
      error: error,
    });
  }
};

// Send Reset Password Token

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required!",
      });
    }

    const user = await userModel
      .findOne({ email: email })
      .select(
        "_id firstName lastName email passwordResetToken passwordResetTokenExpire"
      );

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invaild email!",
      });
    }

    // Generate a random token
    const token = await createRandomToken();
    const expireIn = Date.now() + 10 * 60 * 1000;
    await userModel.findByIdAndUpdate(user._id, {
      passwordResetToken: token,
      passwordResetTokenExpire: expireIn,
    });

    // Send email to user
    const data = {
      user: { name: user.firstName + " " + user.lastName, token: token },
    };

    await sendMail({
      email: user.email,
      subject: "Reset Password",
      template: "reset-password.ejs",
      data,
    });

    res.status(200).send({
      success: true,
      message: "Reset password link send to your email!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in reset password!",
      error: error,
    });
  }
};

// Update Password

export const updatePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(201).send({
        success: false,
        message: "Invalid reset token!",
      });
    }
    if (!newPassword) {
      return res.status(201).send({
        success: false,
        message: "New password is required!",
      });
    }

    // Check User
    const user = await userModel.findOne({
      passwordResetToken: token,
      passwordResetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "Token is invalid or has expired!",
      });
    }

    // Hashed Password
    const hashedPassword = await hashPassword(newPassword);
    // Update password
    const updatePassword = await userModel.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        passwordResetToken: "",
        passwordResetTokenExpire: "",
      },
      { new: true }
    );

    await updatePassword.save();

    res.status(200).send({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update password!",
      error: error,
    });
  }
};

// Update Profile Image

export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.files;
    const imageUrl = file[0].location;

    if (!imageUrl) {
      return res.status(400).send({
        success: false,
        message: "Profile Image is required!",
      });
    }

    const existUser = await userModel
      .findById({ _id: userId })
      .select("_id firstName email profilePicture");

    if (!existUser) {
      return res.status(400).send({
        success: false,
        message: "User not found!",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      { _id: existUser._id },
      { $set: { profilePicture: imageUrl } },
      { new: true }
    );

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile Image updated!",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update profile Image!",
      error: error,
    });
  }
};

// Update Profile Banner

export const updateCoverImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const file = req.files;
    const imageUrl = file[0].location;

    if (!imageUrl) {
      return res.status(400).send({
        success: false,
        message: "Cover photo is required!",
      });
    }

    const existUser = await userModel
      .findById({ _id: userId })
      .select("_id firstName email coverPhoto");

    if (!existUser) {
      return res.status(400).send({
        success: false,
        message: "User not found!",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      { _id: existUser._id },
      { $set: { coverPhoto: imageUrl } },
      { new: true }
    );

    await user.save();

    res.status(200).send({
      success: true,
      message: "Cover Image updated!",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update profile Image!",
      error: error,
    });
  }
};

// Get All User
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all user controller!",
      error: error,
    });
  }
};

// Get Single User
export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.find({ _id: userId }).select("-password");

    res.status(200).send({
      success: true,
      message: "User Info",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get single user controller!",
      error: error,
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel
      .find({ _id: userId })
      .select("_id firstName email password");

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found!",
      });
    }

    await userModel.findByIdAndDelete({ _id: user._id });

    res.status(200).send({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete user controller!",
      error: error,
    });
  }
};

// Upload file
export const uploadFile = async (req, res) => {
  try {
    const file = req.files;
    const fileUrl = file[0].location;

    if (!fileUrl) {
      return res.status(400).send({
        success: false,
        message: "File url is required!",
      });
    }

    res.status(200).send({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in upload file controller!",
      error: error,
    });
  }
};

// Get Contact List with required Data
export const getContactList = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select(
        "_id firstName lastName email profilePicture followers following friendRequests sendFriendRequests"
      )
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all user controller!",
      error: error,
    });
  }
};

// Send Friend Request User
export const sendFriendRequest = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user.user._id;

    if (receiverId === senderId) {
      return res.status(400).send({
        success: false,
        message: "You cannot send a friend request to yourself!",
      });
    }

    const sender = await userModel.findById(senderId);
    const receiver = await userModel.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    // Check if a friend request already exists in sender sendFriendRequests List
    if (sender.sendFriendRequests.includes(receiverId)) {
      return res.status(400).send({
        success: false,
        message: "Friend request already sent!",
      });
    }

    if (receiver.friendRequests.includes(senderId)) {
      return res.status(400).send({
        success: false,
        message: "Friend request already sent!",
      });
    }

    // Check if the users are already friends
    if (receiver.followers.includes(senderId)) {
      return res.status(400).send({
        success: false,
        message: "You are already friends with this user!",
      });
    }

    // Add friend request to the sender & receiver's  list
    receiver.friendRequests.push(senderId);

    sender.sendFriendRequests.push(receiverId);

    await sender.save();
    await receiver.save();

    res.status(200).send({
      success: true,
      message: "Friend request sent successfully!",
      sender: sender,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error send friend request!",
      error: error.message,
    });
  }
};

// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    const sender = await userModel.findById(senderId);
    const receiver = await userModel.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    // Check If friend request Exist
    if (!sender.friendRequests.includes(receiverId)) {
      return res.status(400).send({
        success: false,
        message: "Friend request not found!",
      });
    }

    // Remove from friendRequests
    sender.friendRequests = sender.friendRequests.filter(
      (requestId) => requestId.toString() !== receiverId
    );

    // Also remove from the receiver's sendFriendRequests (or similar property if it exists)
    receiver.sendFriendRequests = receiver.sendFriendRequests.filter(
      (requestId) => requestId.toString() !== senderId
    );

    // Add each other to followers and following
    if (!sender.following.includes(receiverId)) {
      sender.following.push(receiverId);
      receiver.followers.push(senderId);
    }

    if (!receiver.following.includes(senderId)) {
      receiver.following.push(senderId);
      sender.followers.push(receiverId);
    }

    await sender.save();
    await receiver.save();

    res.status(200).send({
      success: true,
      message:
        "Friend request accepted and users are now following each other!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in accepting friend request!",
      error: error.message,
    });
  }
};

// Cancel Friend Request (User send the friend Request)
export const cancelFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    const sender = await userModel.findById(senderId);
    const receiver = await userModel.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    // Check If friend request Exist Both Sender & receiver
    if (!receiver.friendRequests.includes(senderId)) {
      return res.status(400).send({
        success: false,
        message: "Friend request not found!",
      });
    }

    if (!sender.sendFriendRequests.includes(receiverId)) {
      return res.status(400).send({
        success: false,
        message: "Send friend request not found!",
      });
    }

    // Remove from friendRequests
    receiver.friendRequests = receiver.friendRequests.filter(
      (requestId) => requestId.toString() !== senderId
    );

    sender.sendFriendRequests = sender.sendFriendRequests.filter(
      (requestId) => requestId.toString() !== receiverId
    );

    // Unfollow each other
    sender.following = sender.following.filter(
      (followId) => followId.toString() !== receiverId
    );
    receiver.followers = receiver.followers.filter(
      (followerId) => followerId.toString() !== senderId
    );

    receiver.following = receiver.following.filter(
      (followId) => followId.toString() !== senderId
    );

    sender.followers = sender.followers.filter(
      (followerId) => followerId.toString() !== receiverId
    );

    await sender.save();
    await receiver.save();

    res.status(200).send({
      success: true,
      message:
        "Friend request canceled and users are no longer following each other!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in cancel friend request!",
      error: error.message,
    });
  }
};

// Cancel Friend Request (User received the friend Request)
export const cancelReceiveFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    const sender = await userModel.findById(senderId);
    const receiver = await userModel.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    // Check If friend request Exist Both Sender & receiver
    if (!receiver.friendRequests.includes(senderId)) {
      return res.status(400).send({
        success: false,
        message: "Friend request not found!",
      });
    }

    if (!sender.sendFriendRequests.includes(receiverId)) {
      return res.status(400).send({
        success: false,
        message: "Send friend request not found!",
      });
    }

    // Remove from friendRequests
    receiver.friendRequests = receiver.friendRequests.filter(
      (requestId) => requestId.toString() !== senderId
    );

    sender.sendFriendRequests = sender.sendFriendRequests.filter(
      (requestId) => requestId.toString() !== receiverId
    );

    // Unfollow each other
    sender.following = sender.following.filter(
      (followId) => followId.toString() !== receiverId
    );
    receiver.followers = receiver.followers.filter(
      (followerId) => followerId.toString() !== senderId
    );

    receiver.following = receiver.following.filter(
      (followId) => followId.toString() !== senderId
    );

    sender.followers = sender.followers.filter(
      (followerId) => followerId.toString() !== receiverId
    );

    await sender.save();
    await receiver.save();

    res.status(200).send({
      success: true,
      message:
        "Friend request canceled and users are no longer following each other!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in cancel friend request!",
      error: error.message,
    });
  }
};

// Follow User
export const followUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const loggedInUserId = req.user.user._id;

    if (userId === loggedInUserId) {
      return res.status(400).send({
        success: false,
        message: "You cannot follow yourself!",
      });
    }

    const userToFollow = await userModel.findById(userId);
    const loggedInUser = await userModel.findById(loggedInUserId);

    if (!userToFollow) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    if (userToFollow.followers.includes(loggedInUserId)) {
      return res.status(400).send({
        success: false,
        message: "You are already following this user!",
      });
    }

    userToFollow.followers.push(loggedInUserId);
    loggedInUser.following.push(userId);

    await userToFollow.save();
    await loggedInUser.save();

    res.status(200).send({
      success: true,
      message: "User followed successfully!",
      following: loggedInUser.following,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error following user!",
      error: error.message,
    });
  }
};

// Unfollow User
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.user.id;

    const userToUnfollow = await userModel.findById(userId);
    const loggedInUser = await userModel.findById(loggedInUserId);

    if (!userToUnfollow) {
      return res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    if (!userToUnfollow.followers.includes(loggedInUserId)) {
      return res.status(400).send({
        success: false,
        message: "You are not following this user!",
      });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== loggedInUserId.toString()
    );
    loggedInUser.following = loggedInUser.following.filter(
      (id) => id.toString() !== userId.toString()
    );

    await userToUnfollow.save();
    await loggedInUser.save();

    res.status(200).send({
      success: true,
      message: "User unfollowed successfully!",
      following: loggedInUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error unfollowing user!",
      error: error.message,
    });
  }
};
