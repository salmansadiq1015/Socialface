import chatModel from "../../models/Chat/chatModel.js";
import messagesModel from "../../models/Chat/messagesModel.js";
import userModel from "../../models/userModel.js";

// Create Message
export const postMessage = async (req, res) => {
  try {
    const { content, chatId, contentType } = req.body;
    if (!content || !chatId) {
      return res
        .status(400)
        .json({ message: "Invaild data passed into request" });
    }

    const newMessage = {
      sender: req.user.user._id,
      content: content,
      contentType: contentType,
      chat: chatId,
    };

    var message = await messagesModel.create({ ...newMessage });

    message = await message.populate(
      "sender",
      "firstName lastName email avatar isOnline"
    );
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "firstName lastName email profilePicture isOnline",
    });

    await chatModel.findByIdAndUpdate(
      { _id: chatId },
      { latestMessage: message.toObject() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Message created successfully!",
      message: message,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while post message!",
      error: error,
    });
  }
};

// Get All Messages
export const getMessages = async (req, res) => {
  try {
    const messages = await messagesModel
      .find({ chat: req.params.id })
      .populate("sender", "firstName lastName email profilePicture")
      .populate("chat");

    res.status(200).json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while get messages!",
      error: error,
    });
  }
};
