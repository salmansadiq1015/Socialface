import Image from "next/image";
import React from "react";
import { Style } from "./CommonStyle";

export default function NotChat() {
  return (
    <div className="relative col-span-11 custom-md:col-span-8 h-full bg-white dark:bg-slate-950">
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
