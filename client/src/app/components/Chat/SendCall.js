"use client";
import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaPhoneSlash } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import socketIO from "socket.io-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

export default function SendCall({
  selectedChat,
  setIsShowSendCall,
  callType,
}) {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Emit the event to start the call
    if (selectedChat && selectedChat._id) {
      socketId.emit("startCall", {
        callerId: auth.user._id,
        receiverId: selectedChat._id,
        callType: callType,
      });
    }

    // Listen for the event when the call is accepted
    socketId.on("callAccepted", (callData) => {
      const { chatId, receiverId, senderId } = callData;
      if (senderId === auth.user._id) {
        handleCallisPicked();
      }
    });

    // Listen for the event when the call is rejected
    socketId.on("callRejected", (callData) => {
      const { chatId, receiverId, senderId } = callData;

      if (selectedChat._id === chatId && senderId === auth.user._id) {
        callrejectedByReceiver();
      }
    });

    // Cleanup socket events on component unmount
    return () => {
      socketId.off("callAccepted");
      socketId.off("callRejected");
    };
  }, [selectedChat, callType, socketId]);

  // Function to handle call acceptance and navigation
  const handleCallisPicked = () => {
    if (!selectedChat || !selectedChat._id) {
      toast.error("No chat selected!");
      return;
    }
    // Navigate to the room with call type as a query parameter
    router.push(`/calling/${selectedChat._id}?callType=${callType}`);
  };

  // Function to handle call rejection
  const callrejectedByReceiver = () => {
    // Emit a rejection event to the server
    socketId.emit("callRejected", { receiverId: selectedChat._id });
    setIsShowSendCall(false);
    toast.error("Call was rejected.");
  };

  // Cancel Call
  const handelCancelCall = () => {
    // Emit a rejection event to the server
    socketId.emit("callRejected", {
      callData: {
        chatId: selectedChat._id,
        receiverId:
          auth?.user?._id === selectedChat?.users[0]._id
            ? selectedChat?.users[1]._id
            : selectedChat?.users[0]._id,
      },
    });
    setIsShowSendCall(false);
    toast.error("Call was rejected.");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center flex-col bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 px-4">
      {/* Call container */}
      <div className="relative w-[21rem] sm:w-[28rem] py-6 px-6 rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 flex items-center justify-center flex-col gap-4 shadow-xl">
        {/* Profile picture with wave animation */}
        <div className="flex flex-col gap-2 items-center justify-center">
          <div className="relative w-[5rem] h-[5rem] sm:w-[7.5rem] sm:h-[7.5rem] rounded-full ring-4 ring-white shadow-lg overflow-hidden animate-wave-animation1">
            <div className="absolute inset-0 rounded-full bg-orange-400 opacity-50 animate-wave-animation"></div>
            <Image
              src={
                auth?.user?._id === selectedChat?.users[0]._id
                  ? selectedChat?.users[1]?.profilePicture
                  : selectedChat?.users[0]?.profilePicture
              }
              alt="Avatar"
              layout="fill"
              className="w-full h-full rounded-full"
            />
          </div>
          {/* User name */}
          <h3 className="text-white text-lg sm:text-2xl font-semibold animate-fade-in text-center mt-4">
            {auth?.user?._id === selectedChat?.users[0]._id
              ? `${selectedChat?.users[1]?.firstName} ${selectedChat?.users[1]?.lastName}`
              : `${selectedChat?.users[0]?.firstName} ${selectedChat?.users[0]?.lastName}`}
          </h3>
        </div>

        {/* Cancel call button */}
        <span
          className="p-4 mt-10 rounded-full bg-red-600 hover:bg-red-700 hover:shadow-md hover:drop-shadow-md transition-transform transform hover:scale-110 shadow-md cursor-pointer text-white"
          onClick={handelCancelCall}
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Leave this call"
        >
          <FaPhoneSlash className="h-6 w-6" />
        </span>
      </div>

      {/* Tooltip for end call button */}
      <Tooltip
        id="my-tooltip"
        place="bottom"
        effect="solid"
        className="!bg-gradient-to-r !from-orange-500 !via-orange-500 !to-yellow-500 !text-white !text-sm !py-1 !px-3 rounded-md shadow-md"
      />
    </div>
  );
}
