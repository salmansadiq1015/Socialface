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
    const users = await userModel.find({}).select("-password");

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
