import { Server as SocketIOServer } from "socket.io";
import userModel from "./models/userModel.js";

export const initialSocketServer = (server) => {
  const io = new SocketIOServer(server);

  io.on("connection", async (socket) => {
    const { userID } = socket.handshake.query;

    let user;

    // Set the user's status to online in the database
    try {
      user = await userModel.findByIdAndUpdate(
        userID,
        { isOnline: true },
        { new: true }
      );

      if (!user) {
        console.warn(`User with ID ${userID} not found in the database.`);
      } else {
        console.log(`User ${user.firstName} ${user.lastName} is now online.`);

        // Emit event for all users to update their chat lists
        io.emit("newUserData", { userID, isOnline: true });
      }
    } catch (error) {
      console.error("Error updating user's online status:", error);
    }

    // Join Room
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User join room:", room);
    });

    //------------------------- Listen for new message event--------------->
    socket.on("NewMessageAdded", (data) => {
      console.log("New Message Added: ", data);
      io.emit("fetchMessages", data);
    });

    // ----------------------------Handle Typing---------------------------->

    // Typing
    socket.on("typing", (room) => {
      console.log(" start Troom:", room);
      socket.in(room).emit("typing");
    });
    
    socket.on("stop typing", (room) => {
      console.log(" stop Troom:", room);

      socket.in(room).emit("stop typing");
    });

    // -----------------------------Handle Calling-------------------->
    // Handle call initiation
    socket.on("callUser", async ({ selectedChatData }) => {
      const { selectedChatId, senderId, receiverId, callType, isGroup } =
        selectedChatData;

      const senderUser = await userModel
        .findById(senderId)
        .select("firstName lastName profilePicture");

      console.log(
        "Call Data:",
        selectedChatId,
        receiverId,
        callType,
        isGroup,
        senderUser
      );

      const callData = {
        selectedChatId,
        receiverId,
        callType,
        isGroup,
        senderUser,
      };

      // Emit an event to the receiver's socket, asking them to pick up the call

      console.log(`Emitting 'incomingCall' to ${receiverId}`);
      io.emit("incomingCall", callData);
    });

    // --------Handle call rejection--------->
    socket.on("callRejected", ({ callData }) => {
      // Notify the sender that the call was rejected

      io.emit("callRejected", callData);
    });

    // Handle call acceptance
    socket.on("callAccepted", ({ callData }) => {
      console.log("Call accepted to receiver:", JSON.stringify(callData));
      // Notify the sender that the call was accepted and to navigate to the call room
      io.emit("callAccepted", callData);
    });

    // -------------------------Handle disconnect User----------------->
    socket.on("disconnect", async () => {
      console.log(`User with ID: ${userID} disconnected!`);

      try {
        if (user) {
          await userModel.findByIdAndUpdate(
            userID,
            { isOnline: false },
            { new: true }
          );
          console.log(
            `User ${user.firstName} ${user.lastName} is now offline.`
          );

          // Emit event for all users to update their chat lists
          io.emit("newUserData", { userID, isOnline: false });
        } else {
          console.warn(`User ${userID} was not found when disconnecting.`);
        }
      } catch (error) {
        console.error("Error updating user's offline status:", error);
      }
    });
  });
};
