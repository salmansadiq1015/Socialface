"use client";
import UsersListSkelton from "@/app/components/LoadingSkelton/UsersListSkelton";
import { useAuth } from "@/app/context/authContext";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import { LuLoader } from "react-icons/lu";

export default function ContactsList({
  loadUsers,
  contactList,
  getAllContactUsers,
}) {
  const router = useRouter();
  const { auth } = useAuth();
  const [friendRequests, setFriendRequests] = useState([]);
  const [user, setUser] = useState(null);
  const [sendload, setSendLoad] = useState(false);
  const [cancelLoad, setCancelLoad] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (auth?.user?._id) {
      const currentUser = contactList.find((u) => u._id === auth.user._id);
      setUser(currentUser);
      setFriendRequests(currentUser?.sendFriendRequests || []);
    }
  }, [contactList, auth]);

  // -------Send Friend Request------->
  const sendFriendRequest = async (receiverId) => {
    setSendLoad(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/frient/request/${receiverId}`
      );
      if (data?.success) {
        setSendLoad(false);
        toast.success("Friend request sent successfully!");
        setFriendRequests([...friendRequests, receiverId]);
        setUserId("");
      }
    } catch (error) {
      setSendLoad(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // -------Cancel Friend Request------->
  const cancelFriendRequest = async (receiverId) => {
    setCancelLoad(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/cancel/friend/request/${receiverId}`
      );
      if (data?.success) {
        toast.success("Friend request canceled!");
        setFriendRequests(friendRequests.filter((id) => id !== receiverId));
        setCancelLoad(false);
        setUserId("");
      }
    } catch (error) {
      console.log(error);
      setCancelLoad(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4 pr-3">
        <h3 className="text-[17px] font-semibold">All Contacts</h3>
        <span className="cursor-pointer">
          <IoSearch className="h-5 w-5 text-gray-600 dark:text-gray-200" />
        </span>
      </div>
      {!loadUsers ? (
        <div className="w-full border py-1 dark:border-gray-700 rounded-md max-h-[17rem] overflow-y-auto shidden px-1 flex flex-col gap-2 cursor-pointer">
          {contactList &&
            contactList.map((contactUser) => (
              <div
                className="w-full py-1 px-2 rounded-md shadow hover:shadow-md border dark:border-gray-700 flex items-center gap-1"
                key={contactUser._id}
              >
                <div
                  className="flex items-start gap-1 w-full"
                  onClick={() => router.push(`/profile/${contactUser._id}`)}
                >
                  <div className="w-[2.6rem] h-[2.6rem]">
                    <div className="relative w-[2.4rem] h-[2.4rem] bg-white dark:bg-gray-800 rounded-full border border-orange-600 overflow-hidden z-20">
                      <Image
                        src={contactUser?.profilePicture}
                        alt="Profile"
                        layout="fill"
                        className="rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-0">
                    <p className="text-[12px] font-semibold">
                      {contactUser?.firstName + " " + contactUser?.lastName}
                    </p>
                    <span className="text-[12px] text-gray-600 dark:text-gray-300">
                      {contactUser?.email?.slice(0, 5)}...
                      <span>{contactUser?.email?.slice(15, 30)}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end w-full">
                  {friendRequests.includes(contactUser._id) ? (
                    <button
                      disabled={cancelLoad}
                      className={` flex items-center justify-center py-[5px] px-2 rounded-md shadow-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 hover:dark:bg-gray-600 cursor-pointer text-black dark:text-white text-[13px]`}
                      onClick={() => {
                        setUserId(contactUser._id);
                        cancelFriendRequest(contactUser._id);
                      }}
                    >
                      {sendload && userId === contactUser._id ? (
                        <LuLoader className="h-5 w-5 text-black dark:text-white animate-spin" />
                      ) : (
                        "Cancel Request"
                      )}
                    </button>
                  ) : (
                    <button
                      disabled={sendload}
                      className={`flex items-center justify-center py-[5px] px-2 rounded-md shadow-sm bg-orange-500 hover:bg-orange-600 cursor-pointer text-white text-[14px]`}
                      onClick={() => {
                        setUserId(contactUser._id);
                        sendFriendRequest(contactUser._id);
                      }}
                    >
                      {sendload && userId === contactUser._id ? (
                        <LuLoader className="h-5  w-5 text-white animate-spin" />
                      ) : (
                        "Follow"
                      )}
                    </button>
                  )}
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
