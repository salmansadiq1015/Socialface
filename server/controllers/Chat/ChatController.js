import chatModel from "../../models/Chat/chatModel.js";
import userModel from "../../models/userModel.js";

// Create Chat Controller
export const createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User id is required!",
      });
    }

    // Check if Chat already Exist
    var isChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate(
        "users",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      )
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "firstName lastName email profilePicture location about",
    });

    if (isChat.length > 0) {
      return res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user.user._id, userId],
      };

      const createdChat = await chatModel.create(chatData);
      const fullChat = await chatModel
        .findById({ _id: createdChat._id })
        .populate(
          "users",
          "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
        );

      res.status(200).send({
        success: true,
        message: "Chat Created!",
        fullChat: fullChat,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while create chat!",
      error: error,
    });
  }
};

// Fetch  Chats
export const fetchChats = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "User id is required!" });
    }

    await chatModel
      .find({ users: { $elemMatch: { $eq: userId } } })
      .populate(
        "users",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      )
      .populate(
        "groupAdmin",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      )
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select:
            "firstName lastName email profilePicture location about isOnline",
        });
        res.status(200).send({
          results: results,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetch chat!",
      error: "error",
    });
  }
};

// Create Group Chat
export const groupChat = async (req, res) => {
  try {
    const { users, chatName, avatar } = req.body;
    if (!chatName || !users) {
      return res.status(400).send({
        success: false,
        message: "Group name and users are required!",
      });
    }
    if (!avatar) {
      return res.status(400).send({
        success: false,
        message: "Group avatar are required!",
      });
    }

    const userData = JSON.parse(users);

    if (userData.lenght < 2) {
      return res.status(400).send({
        success: false,
        message: "Please select at least 2 users!",
      });
    }
    userData.push(req.user.user);

    const groupChat = await chatModel.create({
      chatName: chatName,
      users: userData,
      isGroupChat: true,
      avatar: avatar,
    });

    // Fetch Group
    const fullGroupChat = await chatModel
      .findById({ _id: groupChat._id })
      .populate(
        "users",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      )
      .populate(
        "groupAdmin",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      );

    res.status(200).send({
      success: true,
      message: "Group chat created successfully!",
      groupChat: fullGroupChat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while create group chat!",
      error: error,
    });
  }
};

// Rename Group
export const renameGroup = async (req, res) => {
  try {
    const chatId = req.params.id;
    const { chatName } = req.body;

    if (!chatName) {
      return res.status(400).send({
        success: false,
        message: "Name is required!",
      });
    }
    const updateChat = await chatModel
      .findByIdAndUpdate({ _id: chatId }, { chatName: chatName }, { new: true })
      .populate(
        "users",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      )
      .populate(
        "groupAdmin",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      );

    res.status(200).send({
      success: true,
      message: "Group name updated!",
      chat: updateChat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while rename group!",
      error: error,
    });
  }
};

// Remove User
export const removeUser = async (req, res) => {
  try {
    const chatId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      res.status(200).send({
        success: false,
        message: "User id is required!",
      });
    }

    const chat = await chatModel
      .findByIdAndUpdate(
        { _id: chatId },
        { $pull: { users: userId } },
        { new: true }
      )
      .populate(
        "users",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      )
      .populate(
        "groupAdmin",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      );

    res.status(200).send({
      success: true,
      message: "User remove from group!",
      chat: chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while remove user!",
      error: error,
    });
  }
};

// Add User
export const addUser = async (req, res) => {
  try {
    const chatId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      res.status(200).send({
        success: false,
        message: "User id is required!",
      });
    }

    const chat = await chatModel
      .findByIdAndUpdate(
        { _id: chatId },
        { $push: { users: userId } },
        { new: true }
      )
      .populate(
        "users",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      )
      .populate(
        "groupAdmin",
        "-password -dateOfBirth -gender -coverPhoto -bio -website -location -followers -following -friendRequests -sendFriendRequests -likedPosts -role -passwordResetToken -passwordResetTokenExpire"
      );

    res.status(200).send({
      success: true,
      message: "User add from group!",
      chat: chat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while add user!",
      error: error,
    });
  }
};

// Delete Chat
export const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    if (!chatId) {
      res.status(400).send({
        success: false,
        message: "Chat id is required!",
      });
    }

    await chatModel.findByIdAndDelete(chatId);

    res.status(200).send({
      success: false,
      message: "Chat Deleted!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while delete user!",
      error: error,
    });
  }
};
