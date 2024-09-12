import { useAuth } from "@/app/context/authContext";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuLoader } from "react-icons/lu";

export default function RequestReceived({
  friendRequests,
  setFriendRequests,
  receivedRequest,
  setReceivedRequest,
}) {
  const [requestUsers, setRequestUsers] = useState([]);
  const { auth, allContacts, user } = useAuth();
  const [userId, setUserId] = useState("");
  const [cancelLoad, setCancelLoad] = useState(false);
  const [approvedLoad, setApprovedLoad] = useState(false);

  useEffect(() => {
    if (allContacts.length === 0 || !user) return;

    // Filter users that exist in `sendFriendRequests`
    const filterRequestUsers = allContacts.filter((contact) =>
      receivedRequest.includes(contact._id)
    );

    setRequestUsers(filterRequestUsers);
  }, [allContacts, user, receivedRequest]);

  // ---------Approved Friend Request------>
  const approvedRequest = async (receiverId) => {
    setApprovedLoad(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/accept/friend/request/${receiverId}`
      );

      if (data?.success) {
        setApprovedLoad(false);

        toast.success("Friend request accepted successfully!");
        setRequestUsers((prevRequestUsers) =>
          prevRequestUsers.filter((item) => item._id !== receiverId)
        );
        setReceivedRequest(
          receivedRequest.filter(
            (friendRequestId) => friendRequestId !== receiverId
          )
        );
      }
    } catch (error) {
      setApprovedLoad(false);
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

        setRequestUsers((prevRequestUsers) =>
          prevRequestUsers.filter((item) => item._id !== receiverId)
        );

        setFriendRequests(
          friendRequests.filter(
            (friendRequestId) => friendRequestId !== receiverId
          )
        );

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
    <div className="flex flex-col gap-4 w-full pb-7 h-screen overflow-y-auto shidden">
      <div className="flex flex-col gap-1 w-full pb-4">
        <h1 className="text-lg sm:text-2xl font-semibold ">
          Friend Request Received
        </h1>
        <span className="text-[15px] text-gray-600 dark:text-gray-300">
          You have received a friend request
        </span>
      </div>
      {requestUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {requestUsers &&
            requestUsers.map((user) => (
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

                  <button
                    disabled={approvedLoad}
                    className="flex items-center justify-center  py-[5px] px-2 rounded-md shadow-sm bg-green-500 hover:bg-green-600 cursor-pointer text-white text-[13px]"
                    onClick={() => {
                      setUserId(user._id);
                      approvedRequest(user._id);
                    }}
                  >
                    {approvedLoad && userId === user._id ? (
                      <LuLoader className="h-5 w-5 text-black dark:text-white animate-spin" />
                    ) : (
                      "Approved Request"
                    )}
                  </button>

                  <button
                    disabled={cancelLoad}
                    className="flex items-center justify-center  py-[5px] px-2 rounded-md shadow-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 hover:dark:bg-gray-600 cursor-pointer text-black dark:text-white text-[13px]"
                    // className={`flex items-center justify-center bg-orange-500/20 text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-200 rounded-md w-full py-2`}
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
              You haven&apos;t received any friend requests.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
