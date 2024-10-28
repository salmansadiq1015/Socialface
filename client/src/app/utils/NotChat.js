import Image from "next/image";
import React from "react";
import { Style } from "./CommonStyle";
import { FiChevronsRight } from "react-icons/fi";

export default function NotChat({ setShow, show }) {
  return (
    <div className="relative col-span-11 custom-md:col-span-8 h-full bg-white dark:bg-slate-950">
      {!show && (
        <div className="flex custom-md:hidden absolute top-1 left-1 z-10">
          <span
            onClick={() => setShow(true)}
            className="p-1 bg-gray-100/60 rounded-full hover:bg-gray-200/70 dark:bg-gray-600/50 hover:dark:bg-gray-500/50"
          >
            <FiChevronsRight className="h-5 w-5" />
          </span>
        </div>
      )}
      <div className="w-full h-full flex items-center justify-center flex-col">
        <Image
          src={"/Sociallogo3.png"}
          alt="/logo"
          height={150}
          width={150}
          className="animate-pulse"
        />
        <h3
          className={`${Style.text_gradient} text-xl font-semibold text-center`}
        >
          Welcome to Socialface Messanger!
        </h3>
        <p className="text-[13px] font-normal text-gray-600 dark:text-gray-200 text-center max-w-[20rem] mt-2">
          Pick a person or group from left sidebar chat list, and start your
          conversation.
        </p>
      </div>
    </div>
  );
}
