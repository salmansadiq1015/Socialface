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

    // Listen for new message event
    socket.on("NewMessageAdded", (data) => {
      console.log("New Message Added: ", data);
      io.emit("fetchMessages", data);
    });

    // Typing Status
    // // Listen for typing and stopTyping events
    // socket.on("typing", (data) => {
    //   socket.broadcast.emit("displayTyping", {
    //     userID: data.userID,
    //     isTyping: true,
    //   });
    // });

    // socket.on("stopTyping", (data) => {
    //   socket.broadcast.emit("displayTyping", {
    //     userID: data.userID,
    //     isTyping: false,
    //   });
    // });

    // Handle disconnect event
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
