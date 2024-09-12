"use client";
import UserLayout from "@/app/components/layouts/UserLayout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { RiUserSharedFill } from "react-icons/ri";
import { RiUserReceivedFill } from "react-icons/ri";
import { ImUsers } from "react-icons/im";
import { RiUserStarFill } from "react-icons/ri";
import { useAuth } from "@/app/context/authContext";
import Image from "next/image";
import { LuLoader } from "react-icons/lu";
import axios from "axios";
import toast from "react-hot-toast";
import SendFriendRequest from "@/app/components/Friends/SendFriendRequest";
import RequestReceived from "@/app/components/Friends/RequestReceived";
import Followers from "@/app/components/Friends/Followers";
import Following from "@/app/components/Friends/Following";

export default function Friends() {
  const [active, setActive] = useState("allUsers");
  const { auth, allContacts, getAllUsers } = useAuth();
  const [friendRequests, setFriendRequests] = useState([]);
  const [sendload, setSendLoad] = useState(false);
  const [cancelLoad, setCancelLoad] = useState(false);
  const [userId, setUserId] = useState("");
  const [receivedRequest, setReceivedRequest] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  console.log("followers:", followers);
  console.log("following:", following);

  useEffect(() => {
    if (auth?.user?._id) {
      const currentUser = allContacts.find((u) => u._id === auth.user._id);
      setFriendRequests(currentUser?.sendFriendRequests || []);
    }
  }, [allContacts, auth]);

  // Received Request
  useEffect(() => {
    if (auth?.user?._id) {
      const currentUser = allContacts.find((u) => u._id === auth.user._id);
      setReceivedRequest(currentUser?.friendRequests || []);
      setCurrentUser(currentUser);
    }
  }, [allContacts, auth]);

  // Remove User That Exist in Following
  useEffect(() => {
    if (auth?.user?._id) {
      const currentUser = allContacts.find((u) => u._id === auth.user._id);
      if (currentUser) {
        const filteredUser = allContacts.filter(
          (u) => !currentUser.following.includes(u._id)
        );
        setAllUser(filteredUser);
      }
    }
  }, [allContacts, auth]);

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

  // -----------Filter Followers-------->

  useEffect(() => {
    if (allContacts && currentUser) {
      // Filter followers from all contacts
      const followersList = allContacts.filter((user) =>
        currentUser.followers.includes(user._id)
      );

      const followingList = allContacts.filter((user) =>
        currentUser.following.includes(user._id)
      );

      setFollowers(followersList);
      setFollowing(followingList);
    }
  }, [allContacts, currentUser]);

  // ----------Filter Followings---------->

  return (
    <UserLayout>
      <div className="w-full h-screen overflow-hidden ">
        <div className="grid grid-cols-9">
          <div className=" col-span-2 sm:col-span-2 py-2 px-3 h-screen border-r dark:border-slate-700">
            <h2 className="  text-sm sm:text-xl font-semibold mb-3">Friends</h2>
            <div className="w-full flex flex-col gap-4">
              <button
                className={`flex items-center justify-center sm:justify-start  gap-2 cursor-pointer rounded-md border dark:border-slate-700 py-2 px-2 hover:bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-800 ${
                  active === "allUsers" && "bg-slate-100 dark:bg-slate-800"
                } hover:shadow-md transition-all duration-200`}
                onClick={() => setActive("allUsers")}
              >
                <span className="h-6 w-6">
                  <HiUserGroup
                    className={`h-full w-full ${
                      active === "allUsers" && "text-orange-600"
                    } `}
                    style={{
                      background:
                        "linear-gradient(to right, #f97316, #ea580c, #c2410c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                </span>
                <span
                  className={`text-[16px] font-medium hidden sm:block ${
                    active === "allUsers" && "text-orange-600"
                  }`}
                >
                  Home
                </span>
              </button>
              {/* <button
                className={`flex items-center justify-center sm:justify-start  gap-2 cursor-pointer rounded-md border dark:border-slate-700 py-2 px-2 hover:bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-800 ${
                  active === "allfriends" && "bg-slate-100 dark:bg-slate-800"
                } hover:shadow-md transition-all duration-200`}
                onClick={() => setActive("allfriends")}
              >
                <span className="h-6 w-6">
                  <HiUserGroup
                    className={`h-full w-full ${
                      active === "allfriends" && "text-orange-600"
                    } `}
                    style={{
                      background:
                        "linear-gradient(to right, #f97316, #ea580c, #c2410c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                </span>
                <span
                  className={`text-[16px] font-medium hidden sm:block ${
                    active === "allfriends" && "text-orange-600"
                  }`}
                >
                  All Friends
                </span>
              </button> */}
              <button
                className={`flex items-center justify-center sm:justify-start  gap-2 cursor-pointer rounded-md border dark:border-slate-700 py-2 px-2 hover:bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-800 ${
                  active === "friendRequest" && "bg-slate-100 dark:bg-slate-800"
                } hover:shadow-md transition-all duration-200`}
                onClick={() => setActive("friendRequest")}
              >
                <span className="h-6 w-6">
                  <RiUserReceivedFill
                    className={`h-full w-full ${
                      active === "friendRequest" && "text-orange-600"
                    } `}
                    style={{
                      background:
                        "linear-gradient(to right, #f97316, #ea580c, #c2410c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                </span>
                <span
                  className={`text-[16px] font-medium hidden sm:block ${
                    active === "friendRequest" && "text-orange-600"
                  }`}
                >
                  Friend Requests
                </span>
              </button>
              <button
                className={`flex items-center justify-center sm:justify-start  gap-2 cursor-pointer rounded-md border dark:border-slate-700 py-2 px-2 hover:bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-800 ${
                  active === "sendRequest" && "bg-slate-100 dark:bg-slate-800"
                } hover:shadow-md transition-all duration-200`}
                onClick={() => setActive("sendRequest")}
              >
                <span className="h-6 w-6">
                  <RiUserSharedFill
                    className={`h-full w-full ${
                      active === "sendRequest" && "text-orange-600"
                    } `}
                    style={{
                      background:
                        "linear-gradient(to right, #f97316, #ea580c, #c2410c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                </span>
                <span
                  className={`text-[16px] font-medium hidden sm:block ${
                    active === "sendRequest" && "text-orange-600"
                  }`}
                >
                  View Send Request
                </span>
              </button>
              <button
                className={`flex items-center justify-center sm:justify-start  gap-2 cursor-pointer rounded-md border dark:border-slate-700 py-2 px-2 hover:bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-800 ${
                  active === "followers" && "bg-slate-100 dark:bg-slate-800"
                } hover:shadow-md transition-all duration-200`}
                onClick={() => setActive("followers")}
              >
                <span className="h-6 w-6">
                  <ImUsers
                    className={`h-full w-full ${
                      active === "followers" && "text-orange-600"
                    } `}
                    style={{
                      background:
                        "linear-gradient(to right, #f97316, #ea580c, #c2410c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                </span>
                <span
                  className={`text-[16px] font-medium hidden sm:block ${
                    active === "followers" && "text-orange-600"
                  }`}
                >
                  Followers
                </span>
              </button>
              <button
                className={`flex items-center justify-center sm:justify-start gap-2 cursor-pointer rounded-md border dark:border-slate-700 py-2 px-2 hover:bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-800 ${
                  active === "following" && "bg-slate-100 dark:bg-slate-800"
                } hover:shadow-md transition-all duration-200`}
                onClick={() => setActive("following")}
              >
                <span className="h-6 w-6">
                  <RiUserStarFill
                    className={`h-full w-full ${
                      active === "following" && "text-orange-600"
                    } `}
                    style={{
                      background:
                        "linear-gradient(to right, #f97316, #ea580c, #c2410c)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                </span>
                <span
                  className={`text-[16px] font-medium hidden sm:block ${
                    active === "following" && "text-orange-600"
                  }`}
                >
                  Following
                </span>
              </button>
            </div>
          </div>
          {/* Right Side */}

          <div className="col-span-7  sm:col-span-7 py-4 px-2 sm:px-4 bg-white dark:bg-slate-950">
            {active === "allUsers" ? (
              <div className="py-1 px-1 sm:px-[2rem] w-full pb-7 h-screen overflow-y-auto shidden ">
                <h1 className="text-lg sm:text-2xl font-semibold pb-4">
                  People you may know
                </h1>
                <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  ">
                  {allUser &&
                    allUser?.map((user) => (
                      <div
                        className="border cursor-pointer  overflow-hidden shadow hover:shadow-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 hover:dark:bg-slate-800 rounded-md dark:border-slate-700 "
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
                          {/* <button className="bg-orange-500/20 text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-200 rounded-md w-full py-2 ">
                            Add Friend
                          </button> */}
                          {friendRequests.includes(user._id) ? (
                            <button
                              disabled={cancelLoad}
                              className={` flex items-center justify-center  py-[5px] px-2 rounded-md shadow-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 hover:dark:bg-gray-600 cursor-pointer text-black dark:text-white text-[13px]`}
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
                              disabled={sendload}
                              className={`flex items-center justify-center py-[5px] px-2 rounded-md shadow-sm bg-orange-500 hover:bg-orange-600 cursor-pointer text-white text-[14px]`}
                              onClick={() => {
                                setUserId(user._id);
                                sendFriendRequest(user._id);
                              }}
                            >
                              {sendload && userId === user._id ? (
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
              </div>
            ) : active === "allfriends" ? (
              <div className="py-1 px-1 sm:px-[2rem]">All Friends</div>
            ) : active === "friendRequest" ? (
              <div className="py-1 px-1 sm:px-[2rem]">
                <RequestReceived
                  friendRequests={friendRequests}
                  setFriendRequests={setFriendRequests}
                  receivedRequest={receivedRequest}
                  setReceivedRequest={setReceivedRequest}
                />
              </div>
            ) : active === "sendRequest" ? (
              <div className="py-1 px-1 sm:px-[2rem]">
                <SendFriendRequest
                  friendRequests={friendRequests}
                  setFriendRequests={setFriendRequests}
                />
              </div>
            ) : active === "followers" ? (
              <div className="py-1 px-1 sm:px-[2rem]">
                <Followers
                  followers={followers}
                  friendRequests={friendRequests}
                  setFriendRequests={setFriendRequests}
                  currentUser={currentUser}
                />
              </div>
            ) : (
              <div className="py-1 px-1 sm:px-[2rem]">
                <Following
                  following={following}
                  setFollowing={setFollowing}
                  getAllUsers={getAllUsers}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
