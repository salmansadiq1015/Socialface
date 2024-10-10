"use client";
import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import React from "react";
import { FaPhoneSlash } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

export default function SendCall({ selectedChat, setCall }) {
  const { auth } = useAuth();
  return (
    <div className="w-full h-screen overflow-hidden flex items-center  gap-4 justify-center flex-col">
      <div className="relative w-[5rem] h-[5rem] sm:w-[7rem] sm:h-[7rem] rounded-full ring-2 object-fill overflow-hidden ring-orange-400 dark:ring-slate-700  animate-zoom-animation">
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

      <span
        className="p-2 mt-[5rem] mr-2 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-300 cursor-pointer text-white"
        onClick={() => setCall(false)}
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Leave this call"
      >
        {" "}
        <FaPhoneSlash className="h-5 w-5" />
      </span>

      <Tooltip
        id="my-tooltip"
        place="bottom"
        effect="solid"
        className="!bg-gradient-to-r !from-orange-500 !via-orange-500 !to-yellow-500 !text-white !text-[11px] !py-1 !px-2"
      />
    </div>
  );
}
