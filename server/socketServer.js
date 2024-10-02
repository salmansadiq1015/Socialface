import { Server as SocketIOServer } from "socket.io";
import userModel from "./models/userModel.js";

export const initialSocketServer = (server) => {
  const io = new SocketIOServer(server);

  io.on("connection", async (socket) => {
    const { userID } = socket.handshake.query;

    if (userID) {
      console.log(`User with ID: ${userID} connected!`);

      // Define user variable
      let user;

      // Set the user's status to online in the database
      try {
        user = await userModel.findByIdAndUpdate(
          userID,
          { isOnline: true },
          { new: true }
        );
        console.log(
          `User ${user.firstName + " " + user.lastName} is now online.`
        );
      } catch (error) {
        console.error("Error updating user's online status:", error);
      }

      // Handle disconnect event
      socket.on("disconnect", async () => {
        console.log(`User with ID: ${userID} disconnected!`);

        // Set the user's status to offline in the database
        try {
          if (user) {
            await userModel.findByIdAndUpdate(
              userID,
              { isOnline: false },
              { new: true }
            );
            console.log(
              `User ${user.firstName + " " + user.lastName} is now offline.`
            );
          } else {
            console.warn(`User ${userID} was not found when disconnecting.`);
          }
        } catch (error) {
          console.error("Error updating user's offline status:", error);
        }
      });
    } else {
      console.log("User ID not provided in the socket query.");
    }
  });
};
