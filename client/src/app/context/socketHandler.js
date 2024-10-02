// SocketHandler.js
import { useEffect } from "react";
import socketIO from "socket.io-client";
import { useAuth } from "./authContext"; // Ensure the correct import path

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

const SocketHandler = () => {
  const { auth, getAllUsers } = useAuth();

  useEffect(() => {
    let socketId;

    if (auth?.user?._id) {
      socketId = socketIO(ENDPOINT, {
        transports: ["websocket"],
        query: { userID: auth.user._id },
      });

      socketId.on("connection", () => {
        console.log("Socket connected!");
        getAllUsers();
      });

      socketId.on("disconnect", () => {
        console.log("Socket disconnected!");
        getAllUsers();
      });

      return () => {
        socketId.disconnect();
      };
    }
  }, [auth?.user?._id]);

  return null; // No need to render anything
};

export default SocketHandler;
