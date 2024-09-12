"use client";
import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GiThreeFriends } from "react-icons/gi";

export default function HomeLeftSide() {
  const { user, auth } = useAuth();

  return (
    <div className="w-full flex flex-col gap-4 py-4 h-screen overscroll-y-auto pl-4 pr-1 shidden">
      {/* Profile */}
      <Link
        href={`/profile/${user ? user?._id : auth?.user?._id}`}
        className="flex items-center gap-2 cursor-pointer rounded-md border dark:border-slate-700 py-1 px-2 hover:bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-800 hover:shadow-md transition-all duration-200"
      >
        <div className="w-[2.8rem] h-[2.8rem]">
          <div className="relative w-[2.6rem] h-[2.6rem] bg-white dark:bg-gray-800 rounded-full border border-orange-600 overflow-hidden z-20">
            <Image
              src={user ? user?.profilePicture : auth?.user?.profilePicture}
              alt="Profile"
              layout="fill"
              className="rounded-lg"
              loading="lazy"
            />
          </div>
        </div>
        <h4 className="text-[17px] font-medium">
          {user
            ? user?.firstName + " " + user?.lastName
            : auth?.user?.firstName + " " + auth?.user?.lastName}
        </h4>
      </Link>
      {/* FRIENDS */}
      <Link
        href={`/friends`}
        className="flex items-center gap-2 cursor-pointer rounded-md border dark:border-slate-700 py-2 px-2 hover:bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-800 hover:shadow-md transition-all duration-200"
      >
        <span className="h-7 w-7">
          <GiThreeFriends
            className="h-full w-full text-orange-600"
            style={{
              background:
                "linear-gradient(to right, #f97316, #ea580c, #c2410c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
        </span>
        <h4 className="text-[17px] font-medium">Friends</h4>
      </Link>
    </div>
  );
}
