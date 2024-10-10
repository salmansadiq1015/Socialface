"use client";
import Search from "@/app/components/Chat/Search";
import UserLayout from "@/app/components/layouts/UserLayout";
import { useAuth } from "@/app/context/authContext";
import { Style } from "@/app/utils/CommonStyle";
import DateFormat from "@/app/utils/dateFormat";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { format } from "timeago.js";
import { FiChevronsLeft } from "react-icons/fi";
import { FiChevronsRight } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import { MdWifiCalling3 } from "react-icons/md";
import { MdVideoCall } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSolidPlusCircle } from "react-icons/bi";
import { PiImageDuotone } from "react-icons/pi";
import { AiTwotoneCamera } from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import { MdOutlineAudiotrack } from "react-icons/md";
import { AiFillLike } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import toast from "react-hot-toast";
import { MdOutlineClosedCaptionDisabled } from "react-icons/md";
import NotChat from "@/app/utils/NotChat";
import MessageLoader from "@/app/LoadingSkelton/MessageLoader";
import ChatLoader from "@/app/LoadingSkelton/ChatLoader";
import { BsEmojiSunglasses } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import socketIO from "socket.io-client";
import { useRouter } from "next/navigation";
import SendCall from "@/app/components/Chat/SendCall";
import ReceiveCall from "@/app/components/Chat/ReceiveCall";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

export default function Messages() {
  const { isActive, setIsActive, auth, friends, allContacts } = useAuth();
  const [personalChats, setPersonalChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [activetab, setActivetab] = useState("personal");
  const [show, setShow] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const closeUploads = useRef(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("text");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageLoad, setMessageLoad] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const closeDetail = useRef(null);
  const [chatLoad, setChatLoad] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const closeEmoji = useRef(null);
  const router = useRouter();
  const [call, setCall] = useState(false);

  console.log("personalChats", personalChats);

  useEffect(() => {
    setIsActive(6);
    // eslint-disable-next-line
  }, [isActive]);

  // Add Emojis
  const onEmojiClick = (event) => {
    console.log("Emoji1", event);

    setMessage((prevContent) => prevContent + event.emoji);
  };

  // All Chats
  const allChats = async () => {
    setChatLoad(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chats/fetch/chat/${auth.user._id}`
      );
      if (data) {
        const personal = data.results.filter(
          (chat) => chat.isGroupChat === false
        );
        const groupData = data.results.filter(
          (chat) => chat.isGroupChat === true
        );
        setPersonalChats(personal);
        setGroupChats(groupData);
        setChatLoad(false);
      }
    } catch (error) {
      console.log(error);
      setChatLoad(false);
    }
  };

  useEffect(() => {
    allChats();

    // eslint-disable-next-line
  }, [auth, allContacts]);

  // Get Chat without Load
  const allChatsWIthoutload = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chats/fetch/chat/${auth.user._id}`
      );
      if (data) {
        const personal = data.results.filter(
          (chat) => chat.isGroupChat === false
        );
        const groupData = data.results.filter(
          (chat) => chat.isGroupChat === true
        );
        setPersonalChats(personal);
        setGroupChats(groupData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update User Status (online|| Offline)

  const updateUserStatusInChats = (updatedUserData) => {
    setPersonalChats((prevChats) =>
      prevChats.map((chat) => {
        const updatedUsers = chat.users.map((user) =>
          user._id === updatedUserData.userID
            ? { ...user, isOnline: updatedUserData.isOnline }
            : user
        );

        // Return the updated chat object
        return { ...chat, users: updatedUsers };
      })
    );

    // Update In Group Chat

    setGroupChats((prevChats) =>
      prevChats.map((chat) => {
        const updatedUsers = chat.users.map((user) =>
          user._id === updatedUserData.userID
            ? { ...user, isOnline: updatedUserData.isOnline }
            : user
        );

        // Return the updated chat object
        return { ...chat, users: updatedUsers };
      })
    );
  };

  useEffect(() => {
    socketId.on("newUserData", (updatedUserData) => {
      // Update User Status
      updateUserStatusInChats(updatedUserData);
      allChatsWIthoutload();
    });

    return () => {
      socketId.off("newUserData", allChatsWIthoutload);
    };
    // eslint-disable-next-line
  }, [socketId]);

  // Get Chat from Local Storage
  useEffect(() => {
    const localChat = localStorage.getItem("newChat");
    if (localChat) {
      setSelectedChat(JSON.parse(localChat));
    }
  }, []);

  //Auto Close Chatbar on Lange Devices
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 880) {
        setShow(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close Upload Files
  useEffect(() => {
    const handleClose = (event) => {
      if (
        closeUploads.current &&
        !closeUploads.current.contains(event.target)
      ) {
        setIsShow(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  // Close Emoji
  useEffect(() => {
    const handleCloseEmoji = (event) => {
      if (closeEmoji.current && !closeEmoji.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleCloseEmoji);

    return () => document.removeEventListener("mousedown", handleCloseEmoji);
  }, []);

  // Close 3Dot Detail
  useEffect(() => {
    const handleClose = (event) => {
      if (closeDetail.current && !closeDetail.current.contains(event.target)) {
        setShowDetail(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  // Fetch Messages
  const fetchMessages = async (e) => {
    if (!selectedChat) {
      return;
    }
    setMessageLoad(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/fetch/messages/${selectedChat._id}`
      );
      if (data) {
        setChatMessages(data.messages);
        setMessageLoad(false);
      }
    } catch (error) {
      setMessageLoad(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchMessages();

    // eslint-disable-next-line
  }, [selectedChat]);

  // Fetch Message Without Load
  const fetchMessageWithoutLoad = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/fetch/messages/${selectedChat._id}`
      );
      if (data) {
        setChatMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const updateChatUserLastMessage = (updateChat) => {
    // Update latestMessage in Personal Chats
    setPersonalChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id === updateChat.chatId) {
          const updatedMessage = {
            ...chat.latestMessage,
            content: updateChat.content,
            createdAt: updateChat.createdAt,
          };

          return { ...chat, latestMessage: updatedMessage };
        }
        return chat;
      })
    );

    // Update latestMessage in Group Chats (If applicable)
    setGroupChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id === updateChat.chatId) {
          const updatedMessage = {
            ...chat.latestMessage,
            content: updateChat.content,
            createdAt: updateChat.createdAt,
          };

          return { ...chat, latestMessage: updatedMessage };
        }
        return chat;
      })
    );
  };

  // Call When New Message Send
  useEffect(() => {
    const handleFetchMessages = (data) => {
      console.log("data", data);
      fetchMessageWithoutLoad();
      updateChatUserLastMessage(data);
    };

    socketId.on("fetchMessages", handleFetchMessages);

    return () => {
      socketId.off("fetchMessages", handleFetchMessages);
    };

    // eslint-disable-next-line
  }, [socketId]);

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/create/message`,
        {
          content: message || "👍",
          contentType: type,
          chatId: selectedChat._id,
        }
      );

      if (data) {
        socketId.emit("NewMessageAdded", {
          content: message || "👍",
          contentType: type,
          chatId: selectedChat._id,
          messageId: data._id,
        });
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  // Send Like
  const handleSendLike = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/messages/create/message`,
        {
          content: "👍",
          contentType: "like",
          chatId: selectedChat._id,
        }
      );

      if (data) {
        socketId.emit("NewMessageAdded", {
          content: "👍",
          contentType: "like",
          chatId: selectedChat._id,
          messageId: data._id,
        });
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // AutoScroll
  useEffect(() => {
    const messageContainer = document.getElementById("message-Container");

    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  // Call Function
  const handleCall = (type) => {
    if (!selectedChat || !selectedChat._id) {
      toast.error("No chat selected!");
      return;
    }
    // Navigate to the room with call type as a query parameter
    router.push(`/calling/${selectedChat._id}?callType=${type}`);
  };
  return (
    <UserLayout title="SocialFace - Messages">
      <div className="relative w-full h-[100%] overflow-x-hidden ">
        <div className="relative w-full h-full grid grid-cols-11">
          <div
            className={`${
              !show
                ? "hidden custom-md:flex flex-col gap-1 col-span-3 border-r dark:border-gray-600  p-1"
                : `w-[21rem] h-full absolute top-0 ${
                    show ? "left-0" : "left-[-50rem]"
                  } z-10 bg-white dark:bg-slate-950 transition-all duration-300`
            }`}
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-3 px-2 py-1">
              <h3
                className={` text-lg sm:text-xl font-semibold ${Style.text_gradient} `}
              >
                Socialface Chats
              </h3>

              <span
                onClick={() => setShow(false)}
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Create New Group"
                className="relative group p-2 bg-gradient-to-r  from-orange-500 to-yellow-500 text-white rounded-full hover:bg-gradient-to-l hover:from-orange-600 hover:to-yellow-600 dark:bg-gray-600/50 hover:dark:bg-gray-500/50"
              >
                <MdGroupAdd className="h-4 w-4" />
              </span>

              {show && (
                <span
                  onClick={() => setShow(false)}
                  className="p-1 bg-gray-100/60 rounded-full hover:bg-gray-200/70 dark:bg-gray-600/50 hover:dark:bg-gray-500/50"
                >
                  <FiChevronsLeft className="h-5 w-5" />
                </span>
              )}
            </div>
            {/* Search */}
            <div className="w-full">
              <Search
                friends={friends}
                allChatsWIthoutload={allChatsWIthoutload}
              />
            </div>
            <hr className="h-[1px] w-full my-2 bg-gray-200 dark:bg-gray-700" />
            {/* -----Chat Buttons----- */}
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between px-2 -mt-1 gap-4">
                <button
                  className={` flex items-center justify-center gap-[3px]  w-full rounded-[2rem] py-[8px] text-[15px] border  border-orange-500 hover:shadow-md transition-all duration-300 cursor-pointer ${
                    activetab === "personal"
                      ? Style.bg_gradient
                      : "text-orange-600"
                  } `}
                  onClick={() => setActivetab("personal")}
                >
                  <FaUser className="h-4 w-4" />
                  Personal
                </button>
                <button
                  className={` flex items-center justify-center gap-[3px]  w-full rounded-[2rem] py-[8px] text-[15px] border  border-orange-500 hover:shadow-md transition-all duration-300 cursor-pointer ${
                    activetab === "group"
                      ? Style.bg_gradient
                      : "text-orange-600"
                  } `}
                  onClick={() => setActivetab("group")}
                >
                  <FaUsers className="h-5 w-5" />
                  Group
                </button>
              </div>
              <hr className="h-[1px] w-full my-2 bg-gray-200 dark:bg-gray-700" />
              {/*-----Chat Users---- */}
              <div className="flex flex-col w-full h-full px-2  overflow-y-scroll max-h-[calc(100vh-40vh)] 2xl:max-h-[calc(100vh-34vh)] 3xl:max-h-[calc(100vh-28vh)] pb-5 shidden">
                {chatLoad ? (
                  <ChatLoader />
                ) : (
                  <div className="flex flex-col gap-2 w-full h-full">
                    {activetab === "personal"
                      ? personalChats.map((chat, i) => (
                          <div
                            key={chat._id}
                            onClick={() => {
                              setSelectedChat(chat);
                              localStorage.setItem(
                                "newChat",
                                JSON.stringify(chat)
                              );
                            }}
                            className="px-2 py-[.4rem] cursor-pointer overflow-hidden flex items-center justify-between gap-1 bg-gray-100 hover:bg-orange-50 dark:bg-slate-800 hover:dark:bg-slate-700 rounded-md hover:shadow-md border border-gray-200 dark:border-slate-700"
                          >
                            <div className="flex items-center gap-[3px]">
                              <div className="relative w-[2.5rem] h-[2.5rem] rounded-full">
                                <Image
                                  src={
                                    chat?.users[1]?._id === auth.user?._id
                                      ? chat?.users[0]?.profilePicture
                                      : chat?.users[1]?.profilePicture
                                  }
                                  alt={
                                    chat?.users[1]?._id === auth.user?._id
                                      ? `${chat?.users[0]?.firstName}`
                                      : `${chat?.users[1]?.firstName}`
                                  }
                                  layout="fill"
                                  className="rounded-full"
                                />

                                <span
                                  className={`absolute bottom-0 right-[.15rem] w-[.5rem] h-[.5rem] rounded-full ${
                                    chat?.users[1]?._id === auth.user?._id
                                      ? chat?.users[0]?.isOnline
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                      : chat?.users[1]?.isOnline
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  } ring-1 ring-gray-100 dark:ring-gray-700 z-10`}
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-gray-900 font-semibold text-[14px] dark:text-gray-200">
                                  {chat?.users[1]?._id === auth.user?._id
                                    ? `${chat?.users[0]?.firstName} ${chat?.users[0]?.lastName}`
                                    : `${chat?.users[1]?.firstName} ${chat?.users[1]?.lastName}`}
                                </span>
                                <span className="text-gray-600 text-[12px] dark:text-gray-300 truncate max-w-[10rem]">
                                  {chat?.latestMessage?.content}
                                </span>
                              </div>
                            </div>
                            {chat?.latestMessage && (
                              <span className="text-[12px] text-gray-600 dark:text-gray-300">
                                {DateFormat(chat?.latestMessage?.createdAt)}
                              </span>
                            )}
                          </div>
                        ))
                      : groupChats.map((chat, i) => (
                          <div
                            key={chat._id}
                            onClick={() => {
                              setSelectedChat(chat);
                              localStorage.setItem(
                                "newChat",
                                JSON.stringify(chat)
                              );
                            }}
                            className="px-2 py-[.4rem] cursor-pointer flex overflow-hidden items-center justify-between gap-1 bg-gray-100 hover:bg-orange-50 dark:bg-slate-800 hover:dark:bg-slate-700 rounded-md hover:shadow-md border border-gray-200 dark:border-slate-700"
                          >
                            <div className="flex items-center gap-[3px]">
                              <div className="relative w-[2.6rem] h-[2.6rem] rounded-full">
                                <Image
                                  src={chat?.avatar}
                                  alt={chat?.chatName}
                                  layout="fill"
                                  className="rounded-full"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-gray-900 font-semibold text-[14px] dark:text-gray-200">
                                  {chat?.chatName}
                                </span>
                                <span className="text-gray-600 text-[12px] dark:text-gray-300 truncate max-w-[10rem]">
                                  {chat?.latestMessage?.content}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-[-8px]">
                              {chat.users.slice(0, 5).map((user) => (
                                <div
                                  key={user._id}
                                  title={`${
                                    user?.isOnline === true
                                      ? user.firstName +
                                        " " +
                                        user.lastName +
                                        " is Online"
                                      : user.firstName +
                                        " " +
                                        user.lastName +
                                        " is Offline"
                                  }`}
                                  className="relative w-6 h-6 rounded-full bg-blue-500 ring-2 ring-orange-100 dark:ring-gray-800 hover:ring-orange-500  transform hover:scale-[1.1] hover:z-10 transition duration-300 ease-in-out"
                                >
                                  <Image
                                    src={user?.profilePicture}
                                    alt="Avatar"
                                    layout="fill"
                                    className="w-full h-full rounded-full"
                                  />
                                  <span
                                    className={`absolute bottom-0 right-0 w-[.3rem] h-[.3rem] rounded-full ${
                                      user?.isOnline === true
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }  ring-1 ring-gray-100 dark:ring-gray-700 z-10`}
                                  ></span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/*-------- Message------ */}
          {selectedChat ? (
            <div className="relative col-span-11 custom-md:col-span-8 h-full bg-orange-500 ">
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
              <div className="w-full h-[calc(100vh-5.4rem)] sm:h-[calc(100vh-3.6rem)] bg-white dark:bg-slate-950 flex flex-col">
                {/* Header Section */}
                <div className="h-[3.2rem] flex items-center justify-between bg-gradient-to-r from-orange-500 via-orange-500 to-yellow-500 px-2 py-2">
                  {/* UserInfo */}
                  <div className="flex items-center gap-1 ">
                    <div className="relative w-[2.6rem] h-[2.6rem] rounded-full overflow-hidden">
                      <Image
                        src={
                          selectedChat?.isGroupChat
                            ? selectedChat?.avatar
                            : selectedChat?.users[1]?._id === auth.user?._id
                            ? selectedChat?.users[0]?.profilePicture
                            : selectedChat?.users[1]?.profilePicture
                        }
                        alt={`User`}
                        layout="fill"
                        className="rounded-full ring-2 ring-green-200 dark:ring-green-200"
                      />
                    </div>
                    <div className="flex flex-col leading-tight ">
                      <span className="text-[17px] font-medium text-gray-50">
                        {selectedChat?.isGroupChat
                          ? selectedChat?.chatName
                          : selectedChat?.users[1]?._id === auth.user?._id
                          ? `${selectedChat?.users[0]?.firstName} ${selectedChat?.users[0]?.lastName}`
                          : `${selectedChat?.users[1]?.firstName} ${selectedChat?.users[1]?.lastName}`}
                      </span>
                      <span className="text-green-600 text-[13px]">
                        Typing
                        <span className="dot-1 font-bold text-[18px]">.</span>
                        <span className="dot-2 font-bold text-[18px]">.</span>
                        <span className="dot-3 font-bold text-[18px]">.</span>
                      </span>
                    </div>
                  </div>
                  {/* Call Info */}
                  <div className=" relative flex items-center gap-4">
                    <span
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Start a voice call"
                      className="p-1 bg-gray-100/80 rounded-full hover:bg-gray-200/70"
                      onClick={() => setCall(true)}
                      // handleCall("audio")
                    >
                      <MdWifiCalling3 className="h-5 w-5 text-orange-500 hover:text-orange-600 cursor-pointer" />
                    </span>
                    <span
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Start a video call"
                      className="p-1 bg-gray-100/80 rounded-full hover:bg-gray-200/70"
                      onClick={() => handleCall("video")}
                    >
                      <MdVideoCall className="h-5 w-5 text-orange-500 hover:text-orange-600 cursor-pointer" />
                    </span>
                    <span
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Conversation Information"
                      className="relative p-1 bg-gray-100/80 rounded-full hover:bg-gray-200/70 "
                      onClick={() => setShowDetail(!showDetail)}
                    >
                      <BsThreeDotsVertical className="h-5 w-5 text-orange-500 hover:text-orange-600 cursor-pointer" />
                    </span>
                    {showDetail && (
                      <div
                        ref={closeDetail}
                        className="absolute top-[2rem] left-[-7.5rem] w-[14rem] flex flex-col gap-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 py-3 px-3 z-10"
                      >
                        <div
                          onClick={() => {
                            localStorage.removeItem("newChat");
                            setSelectedChat(null);
                            setShowDetail(false);
                          }}
                          className="flex items-center gap-1 rounded-sm hover:text-orange-600 border py-1 px-2 cursor-pointer hover:border-orange-500 transition-all duration-300"
                        >
                          <span>
                            <MdOutlineClosedCaptionDisabled className="h-5 w-5 " />
                          </span>
                          <span className="text-[15px] font-medium">
                            Close Conversation
                          </span>
                        </div>
                        {/*  */}
                        <div className="flex items-center gap-1 rounded-sm hover:text-orange-600 border py-1 px-2 cursor-pointer hover:border-orange-500 transition-all duration-300">
                          <span>
                            <MdOutlineAudiotrack className="h-5 w-5 " />
                          </span>
                          <span className="text-[15px] font-medium">
                            Upload Audio
                          </span>
                        </div>
                        {/*  */}
                        <div className="flex items-center gap-1 rounded-sm hover:text-orange-600 border py-1 px-2 cursor-pointer hover:border-orange-500 transition-all duration-300">
                          <span>
                            <AiTwotoneCamera className="h-5 w-5 " />
                          </span>
                          <span className="text-[15px] font-medium">
                            Upload Videos
                          </span>
                        </div>
                        {/*  */}
                        <div className="flex items-center gap-1 rounded-sm hover:text-orange-600 border py-1 px-2 cursor-pointer hover:border-orange-500 transition-all duration-300">
                          <span>
                            <CgFileDocument className="h-5 w-5 " />
                          </span>
                          <span className="text-[15px] font-medium">
                            Upload Files
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages Section shidden */}

                <div
                  id="message-Container"
                  className="flex-grow overflow-y-auto flex flex-col gap-3 bg-white dark:bg-slate-950 px-2 py-2"
                >
                  {messageLoad ? (
                    <MessageLoader />
                  ) : (
                    <>
                      {chatMessages?.map((message) => (
                        <div
                          className={`flex items-start gap-1 max-w-[80%] sm:max-w-[50%] ${
                            message?.sender?._id === auth?.user?._id
                              ? "ml-auto flex-row-reverse"
                              : "mr-auto flex-row"
                          }`}
                          key={message._id}
                        >
                          <div className="w-[2.5rem] h-[2.5rem]">
                            <div className="relative w-[2.2rem] h-[2.2rem] rounded-full overflow-hidden">
                              <Image
                                src={message?.sender?.profilePicture}
                                alt={`Avatar`}
                                layout="fill"
                                className="rounded-full"
                              />
                            </div>
                          </div>
                          {message.contentType === "text" ? (
                            <div
                              className={`  rounded-lg text-[14px] px-3 py-2 mt-4 ${
                                message?.sender?._id === auth?.user?._id
                                  ? "bg-orange-500 text-white rounded-tr-none"
                                  : "bg-gray-200 text-black dark:text-white dark:bg-gray-700 rounded-tl-none"
                              }`}
                            >
                              <p>{message?.content}</p>
                            </div>
                          ) : (
                            <div className="text-4xl">{message?.content}</div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Send Message Section */}
                <div className=" relative min-h-[3.4rem] max-h-[3.5rem] h-[2.4rem] flex items-center gap-4 bg-gray-100 dark:bg-gray-900 px-2 py-2 ">
                  <div className="relative">
                    <span
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Open more options"
                      onClick={() => setIsShow(!isShow)}
                    >
                      <BiSolidPlusCircle
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Open more options"
                        className=" w-5 h-5 sm:h-6 sm:w-6 text-orange-500 cursor-pointer"
                      />
                    </span>
                    {isShow && (
                      <div
                        ref={closeUploads}
                        className="absolute top-[-11.5rem] right-[-14rem] w-[14rem] flex flex-col gap-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 py-3 px-3 z-10"
                      >
                        <div className="flex items-center gap-1 rounded-sm hover:text-orange-600 border py-1 px-2 cursor-pointer hover:border-orange-500 transition-all duration-300">
                          <span>
                            <PiImageDuotone className="h-5 w-5 " />
                          </span>
                          <span className="text-[15px] font-medium">
                            Upload Images
                          </span>
                        </div>
                        {/*  */}
                        <div className="flex items-center gap-1 rounded-sm hover:text-orange-600 border py-1 px-2 cursor-pointer hover:border-orange-500 transition-all duration-300">
                          <span>
                            <MdOutlineAudiotrack className="h-5 w-5 " />
                          </span>
                          <span className="text-[15px] font-medium">
                            Upload Audio
                          </span>
                        </div>
                        {/*  */}
                        <div className="flex items-center gap-1 rounded-sm hover:text-orange-600 border py-1 px-2 cursor-pointer hover:border-orange-500 transition-all duration-300">
                          <span>
                            <AiTwotoneCamera className="h-5 w-5 " />
                          </span>
                          <span className="text-[15px] font-medium">
                            Upload Videos
                          </span>
                        </div>
                        {/*  */}
                        <div className="flex items-center gap-1 rounded-sm hover:text-orange-600 border py-1 px-2 cursor-pointer hover:border-orange-500 transition-all duration-300">
                          <span>
                            <CgFileDocument className="h-5 w-5 " />
                          </span>
                          <span className="text-[15px] font-medium">
                            Upload Files
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <span
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Select Emoji"
                      onClick={() => setShowEmoji(!showEmoji)}
                    >
                      <BsEmojiSunglasses className=" w-5 h-5  text-orange-500 cursor-pointer" />
                    </span>
                    {showEmoji && (
                      <div
                        ref={closeEmoji}
                        className="absolute top-[-21rem] right-[-18rem]  flex flex-col gap-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 py-1 px-1 z-20"
                      >
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                  </div>
                  <div className="w-full h-full ">
                    <form
                      onSubmit={handleSendMessage}
                      className="w-full h-full rounded-lg flex items-center gap-2"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="w-full h-full px-4 rounded-[2rem] border outline-none focus:border-orange-500"
                      />
                      {message.length > 0 ? (
                        <button
                          type="submit"
                          className=""
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Press enter to send"
                        >
                          <IoSend
                            className={`h-6 w-6 text-orange-600 cursor-pointer`}
                          />
                        </button>
                      ) : (
                        <span
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Send a like"
                          onClick={() => {
                            handleSendLike();
                          }}
                        >
                          <AiFillLike
                            className={`h-6 w-6 text-orange-600 cursor-pointer`}
                          />
                        </span>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <NotChat />
          )}
        </div>

        {/* ------------Send Call------- */}
        {/* {call && (
          <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-[99999] bg-white dark:bg-slate-950">
            <SendCall selectedChat={selectedChat} setCall={setCall} />
          </div>
        )} */}

        {/* ----------Pick Call------- */}
        {call && (
          <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-[99999] bg-white dark:bg-slate-950">
            <ReceiveCall selectedChat={selectedChat} setCall={setCall} />
          </div>
        )}
      </div>
    </UserLayout>
  );
}
