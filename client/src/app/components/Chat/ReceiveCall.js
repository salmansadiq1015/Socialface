import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { FaPhoneSlash } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";

// Socket
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

export default function ReceiveCall({
  setIsShowReceiveCall,
  selectedChat,
  callType,
}) {
  const { auth } = useAuth();
  const router = useRouter();

  const handleCallAccepted = () => {
    if (!selectedChat || !selectedChat._id) {
      toast.error("No chat selected!");
      return;
    }
    // Emit acceptance to server
    socketId.emit("callAccepted", {
      callData: {
        chatId: selectedChat._id,
        receiverId: auth.user._id,
        senderId:
          auth?.user?._id === selectedChat?.users[0]._id
            ? selectedChat?.users[1]._id
            : selectedChat?.users[0]._id,
      },
    });
    // Navigate to the room with call type as a query parameter
    router.push(`/calling/${selectedChat._id}?callType=${callType}`);
  };

  // Handle Reject Call
  const handleCallRejected = () => {
    // Emit rejection to server
    socketId.emit("callRejected", {
      callData: {
        chatId: selectedChat._id,
        receiverId: auth.user._id,
        senderId:
          auth?.user?._id === selectedChat?.users[0]._id
            ? selectedChat?.users[1]._id
            : selectedChat?.users[0]._id,
      },
    });
    setIsShowReceiveCall(false);
  };

  // -------In Sender Reject Call------>

  useEffect(() => {
    socketId.on("callRejected", (callData) => {
      const { chatId, receiverId } = callData;

      if (selectedChat._id === chatId && receiverId === auth.user._id) {
        setIsShowReceiveCall(false);
        toast.error("Missed call!");
      }
    });

    // Cleanup socket events on component unmount
    return () => {
      socketId.off("callRejected");
    };
  }, [socketId]);

  return (
    <div className="w-full h-screen overflow-hidden flex items-center  gap-4 justify-center flex-col px-4 py-4 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      <div className=" w-[21rem] sm:w-[28rem] py-5 px-4 rounded-lg bg-gradient-to-r from-orange-600 via-orange-500 to-orange-300 flex items-center justify-center flex-col gap-4">
        <div className="relative w-[4rem] h-[4rem] sm:w-[5rem] sm:h-[5rem] rounded-full ring-4 ring-white shadow-lg overflow-hidden animate-wave-animation">
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
        <div className="flex flex-col gap-1">
          <h3 className="text-white animate-fade-in text-center">
            {auth?.user?._id === selectedChat?.users[0]._id
              ? selectedChat?.users[1]?.firstName +
                " " +
                selectedChat?.users[1]?.lastName
              : selectedChat?.users[0]?.firstName +
                " " +
                selectedChat?.users[0]?.lastName}
          </h3>

          <span className="text-orange-50 animate-pulse text-[13px] text-center">
            Incoming call...
          </span>
        </div>

        <div className="flex items-center justify-center gap-[2rem]">
          <span
            className="py-2 px-[2rem] mt-4 mr-2 rounded-[2rem] bg-red-600 hover:bg-red-700 transition-all duration-300 cursor-pointer text-white"
            onClick={() => handleCallRejected()}
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Leave this call"
          >
            {" "}
            <FaPhoneSlash className="h-5 w-5" />
          </span>
          <span
            className="py-2 px-[2rem] mt-[1rem] mr-2 rounded-[2rem] bg-green-600 hover:bg-green-700 transition-all duration-300 cursor-pointer text-white animate-shake"
            onClick={() => handleCallAccepted()}
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Accept this call"
          >
            <FaPhone className="h-5 w-5" />
          </span>
        </div>
      </div>
    </div>
  );
}
