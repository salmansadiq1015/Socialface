"use client";
import UsersListSkelton from "@/app/components/LoadingSkelton/UsersListSkelton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { IoSearch } from "react-icons/io5";

export default function FriendList({ loadFriends, friendsList }) {
  const router = useRouter();
  return (
    <div className="w-full  flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4 pr-3">
        <h3 className="text-[17px] font-semibold">Friends</h3>
        <span className="cursor-pointer ">
          <IoSearch className="h-5 w-5 text-gray-600 dark:text-gray-200" />
        </span>
      </div>
      {!loadFriends ? (
        <div className="w-full border py-1 dark:border-gray-700 rounded-md max-h-[17rem] overflow-y-auto shidden px-1 flex flex-col gap-2 cursor-pointer">
          {friendsList &&
            friendsList.map((user) => (
              <div
                className="w-full py-1 px-2 rounded-md shadow hover:shadow-md border dark:border-gray-700 flex items-center gap-1"
                key={user._id}
              >
                <div
                  className="flex items-start gap-1 w-full "
                  onClick={() => router.push(`/profile/${user._id}`)}
                >
                  <div className="w-[2.6rem] h-[2.6rem]">
                    <div className="relative w-[2.4rem] h-[2.4rem] bg-white dark:bg-gray-800 rounded-full border border-orange-600 overflow-hidden z-20">
                      <Image
                        src={user?.profilePicture}
                        alt="Profile"
                        layout="fill"
                        className="rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex  flex-col gap-0">
                    <p className="text-[13px] font-semibold">
                      {user?.firstName + " " + user?.lastName}
                    </p>
                    <span className="text-[12px] text-gray-600 dark:text-gray-300">
                      {user?.email?.slice(0, 5)}...
                      <span>{user?.email?.slice(15, 30)}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end  ">
                  <button className="py-[5px] px-2 rounded-md   shadow-sm bg-orange-500 hover:bg-orange-600 cursor-pointer text-white text-[14px] ">
                    Following
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="w-full max-h-[17rem] overflow-y-auto shidden px-1 flex flex-col gap-2">
          <UsersListSkelton />
        </div>
      )}
    </div>
  );
}
