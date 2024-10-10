import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import React from "react";
import { FaPhoneSlash } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";

export default function ReceiveCall({ selectedChat, setCall }) {
  const { auth } = useAuth();
  return (
    <div className="w-full h-screen overflow-hidden flex items-center  gap-4 justify-center flex-col px-4 py-4">
      <div className="w-[28rem] py-5 px-4 rounded-lg bg-gradient-to-r from-orange-600 via-orange-500 to-orange-300 flex items-center justify-center flex-col gap-4">
        <div className="relative w-[4rem] h-[4rem] sm:w-[5.5rem] sm:h-[5.5rem] rounded-full ring-2 object-fill overflow-hidden ring-orange-400 dark:ring-slate-700  animate-zoom-animation">
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
            onClick={() => setCall(false)}
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Leave this call"
          >
            {" "}
            <FaPhoneSlash className="h-5 w-5" />
          </span>
          <span
            className="py-2 px-[2rem] mt-[1rem] mr-2 rounded-[2rem] bg-green-600 hover:bg-green-700 transition-all duration-300 cursor-pointer text-white animate-shake"
            onClick={() => setCall(false)}
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
