import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";

export default function Followers({
  followers,
  friendRequests,
  setFriendRequests,
  currentUser,
}) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelLoad, setCancelLoad] = useState(false);

  // -------Send Friend Request------->
  const sendFriendRequest = async (receiverId) => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/frient/request/${receiverId}`
      );
      if (data?.success) {
        setLoading(false);
        toast.success("Friend request sent successfully!");
        setFriendRequests([...friendRequests, receiverId]);
        setUserId("");
      }
    } catch (error) {
      setLoading(false);
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

  const isFollowing = (userId) => {
    return currentUser?.following?.includes(userId);
  };

  // Check if a friend request has been sent
  const hasSentFriendRequest = (userId) => {
    return friendRequests?.includes(userId);
  };
  return (
    <div className="flex flex-col gap-4 w-full pb-7 h-screen overflow-y-auto shidden">
      <div className="flex flex-col gap-1 w-full pb-4">
        <h1 className="text-lg sm:text-2xl font-semibold ">Followers</h1>
        <span className="text-[15px] text-gray-600 dark:text-gray-300">
          These users are following you
        </span>
      </div>
      {followers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {followers &&
            followers.map((user) => (
              <div
                className="border cursor-pointer overflow-hidden shadow hover:shadow-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 hover:dark:bg-slate-800 rounded-md dark:border-slate-700"
                key={user._id}
              >
                <div className="relative w-full h-[8rem]">
                  <Image
                    src={user?.profilePicture}
                    layout="fill"
                    alt="Profile"
                    className="h-full w-full"
                  />
                </div>
                <div className="flex flex-col gap-4 py-2 px-4">
                  <h4 className="text-[16px] font-medium">
                    {user?.firstName + " " + user?.lastName}
                  </h4>

                  {!isFollowing(user._id) && (
                    <>
                      {hasSentFriendRequest(user._id) ? (
                        <button
                          disabled={cancelLoad}
                          className="flex items-center justify-center py-[5px] px-2 rounded-md shadow-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 hover:dark:bg-gray-600 cursor-pointer text-black dark:text-white text-[13px]"
                          onClick={() => {
                            setUserId(user._id);
                            cancelFriendRequest(user._id);
                          }}
                        >
                          {cancelLoad && userId === user._id ? (
                            <LuLoader className="h-5 w-5 text-black dark:text-white animate-spin" />
                          ) : (
                            "Cancel Request"
                          )}
                        </button>
                      ) : (
                        <button
                          disabled={loading}
                          className="flex items-center justify-center py-[5px] px-2 rounded-md shadow-sm bg-green-500 hover:bg-green-600 cursor-pointer text-white text-[13px]"
                          onClick={() => {
                            setUserId(user._id);
                            sendFriendRequest(user._id);
                          }}
                        >
                          {loading && userId === user._id ? (
                            <LuLoader className="h-5 w-5 text-black dark:text-white animate-spin" />
                          ) : (
                            "Follow Back"
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex items-end justify-center w-full min-h-[60vh]">
          <div className="flex flex-col items-end justify-center ">
            <div className="relative w-[16em] h-[16rem] animate-pulse">
              <Image
                src="/requestnotfound.png"
                layout="fill"
                alt="Notfound"
                className="w-full h-full"
              />
            </div>
            <span className="text-[15px] text-center w-full text-gray-600 dark:text-gray-300">
              You haven&apos;t any followers.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
