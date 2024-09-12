import React, { useRef, useState } from "react";

import { BsEmojiSmile } from "react-icons/bs";
import Image from "next/image";
import { useAuth } from "@/app/context/authContext";
import { FaPhotoVideo } from "react-icons/fa";
import { MdVideoCameraFront } from "react-icons/md";
import { BsEmojiSunglasses } from "react-icons/bs";
import { IoCloseCircle } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Style } from "@/app/utils/CommonStyle";
import toast from "react-hot-toast";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { LuPauseCircle } from "react-icons/lu";
import { FiPlayCircle } from "react-icons/fi";

export default function CreatePost({ getAllPost }) {
  const { auth } = useAuth();
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [show, setShow] = useState(false);
  // const [emojiShow, setEmojiShow] = useState(false);
  const [content, setContent] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("");
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play & Paused
  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Add Emojis
  const onEmojiClick = (event) => {
    console.log("Emoji1", event);

    setContent((prevContent) => prevContent + event.emoji);
  };

  // ------------Create Post------->

  const handlePost = async (url, type) => {
    try {
      const data = axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/create/post`,
        {
          userId: auth.user._id,
          userName: auth.user.firstName + " " + auth.user.lastName,
          profileImage: auth.user.profilePicture,
          mediaUrl: url,
          mediaType: type,
          content,
        }
      );
      getAllPost();
      if (data) {
        toast.success("New Post Created!");
        setShow(false);
        setContent("");
        setMediaUrl("");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration <= 1200) {
          resolve(true);
        } else {
          resolve(false);
        }
      };

      video.onerror = () => {
        reject(new Error("Failed to load video"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const fileType = (file) => {
    if (file.type.startsWith("video/")) {
      setMediaType("Video");
    } else if (file.type.startsWith("image/")) {
      setMediaType("Image");
    } else {
      toast.error("Invalid file type");
      return;
    }
    setMediaUrl(file);
  };

  //
  const UploadFiles = async () => {
    const maxFileSize = 20 * 1024 * 1024;

    if (mediaUrl.size > maxFileSize) {
      toast.error("File size must be less than 20 MB");
      return;
    }

    if (mediaUrl.type.startsWith("video/")) {
      const isValidDuration = await validateVideoDuration(mediaUrl);
      if (!isValidDuration) {
        toast.error("Video duration must be less than 20 mints");
        return;
      }
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", mediaUrl);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/upload/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handlePost(data.url, mediaType);
    } catch (error) {
      console.error(error);
      toast.error("File type not supported");
      setLoading(false);
    }
  };

  // Prevent Cursor
  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  //

  return (
    <div className=" px-2 sm:px-[2rem] relative ">
      <div className="w-full rounded-lg shadow-md bg-white border dark:border-gray-700 py-4 px-3 flex flex-col gap-4 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-[3.2rem] h-[3.2rem]">
            <div className="relative w-[3rem] h-[3rem] bg-white dark:bg-gray-800 rounded-full border-2 border-orange-600 overflow-hidden z-20">
              <Image
                src={auth?.user?.profilePicture}
                alt="Profile"
                layout="fill"
                className="rounded-lg"
              />
            </div>
          </div>
          <input
            onClick={() => setShow(true)}
            placeholder={`What's on your mind, ${auth?.user?.firstName}`}
            value={content}
            className="w-full h-[2.6rem] rounded-[2rem] border-none outline-none bg-gray-200 flex items-center hover:bg-gray-300 transition-all duration-200 cursor-pointer dark:bg-gray-700 px-3"
          />
        </div>
        <hr className="my-2 w-full h-[1px] bg-gray-400" />
        {/*  */}
        <div className="flex items-center justify-between px-0 sm:px-3">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShow(true)}
          >
            <FaPhotoVideo className="text-sky-600 h-6 w-6" />{" "}
            <span className="font-medium text-[15px]">Photo/video</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <MdVideoCameraFront className="text-orange-600 h-6 w-6" />{" "}
            <span className="font-medium text-[15px]">Live video</span>
          </div>
          <div
            className="hidden sm:flex items-center gap-2  cursor-pointer"
            onClick={() => setShow(true)}
          >
            <BsEmojiSunglasses className="text-yellow-500 h-6 w-6" />{" "}
            <span className="font-medium text-[15px]">Feeling/activity</span>
          </div>
        </div>
      </div>
      {/* ------------Post Modal------ */}
      {show && (
        <div className="fixed top-0 left-0 w-full h-full z-[9999] bg-white/90 dark:bg-black/80 flex items-center justify-center py-2 px-3 sm:px-4">
          <div className="w-[28rem] py-2 rounded-lg shadow-md bg-white dark:bg-gray-800 border dark:border-gray-700 ">
            <div className="relative w-full py-1">
              <h3 className="text-xl font-semibold text-center">Create Post</h3>
              <span
                className="absolute top-2 right-3 z-10"
                onClick={() => setShow(false)}
              >
                <IoCloseCircle className="h-7 w-7 text-gray-500 dark:text-white cursor-pointer" />
              </span>
            </div>
            <hr className="my-2 w-full h-[1px] bg-gray-400" />
            {/*  */}
            <div className="flex flex-col gap-4 w-full px-3 sm:px-4">
              <div className="flex items-center gap-2">
                <div className="w-[3.2rem] h-[3.2rem]">
                  <div className="relative w-[3rem] h-[3rem] bg-white dark:bg-gray-800 rounded-full border-2 border-orange-600 overflow-hidden z-20">
                    <Image
                      src={auth?.user?.profilePicture}
                      alt="Profile"
                      layout="fill"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <span className="font-medium text-[16px]">
                  {auth?.user?.firstName + " " + auth?.user?.lastName}{" "}
                  {selectedEmoji && (
                    <>
                      {selectedEmoji?.native} {selectedEmoji?.name}
                    </>
                  )}
                </span>
              </div>
              {/*  */}
              <div className="flex items-center gap-2">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`What's on your mind, ${auth?.user?.firstName}`}
                  autoFocus
                  className="h-[4rem] resize-none w-full border-none bg-transparent outline-none "
                  onClick={() => setShowPicker(false)}
                />
                <div className="relative mt-[-2rem]">
                  <span onClick={() => setShowPicker(!showPicker)}>
                    <BsEmojiSmile className="text-yellow-600 z-20 h-6 w-6 cursor-pointer" />
                  </span>
                  {showPicker && (
                    <span className="absolute top-6 right-4 z-40">
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </span>
                  )}
                </div>
              </div>
              {/* Add Video / Image */}
              <div className="w-full p-3 border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 rounded-lg shadow relative">
                <span
                  onClick={() => setMediaUrl("")}
                  className=" absolute top-1 right-2 z-20 border border-gray-300 dark:border-gray-700 shadow cursor-pointer p-1 rounded-full bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-100"
                >
                  <IoClose className="h-5 w-5" />
                </span>
                {mediaUrl ? (
                  <div className="relative w-full h-[12rem] rounded-lg bg-gray-100 dark:bg-gray-700">
                    {mediaType === "Image" ? (
                      <Image
                        src={URL.createObjectURL(mediaUrl)}
                        layout="fill"
                        alt="Story"
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          ref={videoRef}
                          src={URL.createObjectURL(mediaUrl)}
                          // autoPlay
                          onContextMenu={handleContextMenu}
                          className="rounded-lg w-full h-full object-cover "
                        />
                        <div className="absolute top-[40%] left-[45%]  p-1 flex justify-center items-center">
                          <button
                            onClick={togglePlayPause}
                            className="bg-white/20 hover:bg-white/75 opacity-50 hover:opacity-100 cursor-pointer p-2 rounded-full"
                          >
                            {isPlaying ? (
                              <LuPauseCircle className="h-6 w-6 text-red-500" />
                            ) : (
                              <FiPlayCircle className="h-6 w-6 text-black" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="post"
                    className="bg-gray-100 dark:bg-gray-700/50 w-full h-[12rem] rounded-lg flex items-center justify-center flex-col cursor-pointer"
                  >
                    <input
                      type="file"
                      id="post"
                      accept="image/*,video/*"
                      onChange={(e) => fileType(e.target.files[0])}
                      className="hidden"
                    />
                    <span className="p-2 rounded-full bg-gray-200">
                      <MdAddPhotoAlternate className="h-8 w-8 text-orange-600" />
                    </span>
                    <h3 className="text-[14px] font-medium ">
                      Add photo/video
                    </h3>
                    <span className="text-[11px] font-[200] text-gray-500">
                      or drag and drop
                    </span>
                  </label>
                )}
              </div>
              {/*  */}
              <button
                disabled={content.length === 0 || !mediaUrl ? true : false}
                className={`${Style.button1}  ${
                  content.length === 0 || !mediaUrl
                    ? "bg-gray-300 dark:bg-gray-700 cursor-no-drop "
                    : ""
                }`}
                style={{ height: "2.4rem" }}
                onClick={UploadFiles}
              >
                {loading ? (
                  <FiLoader className="h-5 w-5 text-white animate-spin" />
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

{
  //   import data from "@emoji-mart/data";
  // import Picker from "@emoji-mart/react";
  // handleEmojiSelect
  // const handleEmojiSelect = (emoji) => {
  //   setSelectedEmoji(emoji);
  //   console.log(emoji); // You can log or use the emoji as needed
  // };
  /* <span onClick={() => setEmojiShow(!emojiShow)}>
<BsEmojiSmile className="text-yellow-600 h-6 w-6 cursor-pointer" />
</span>
{emojiShow && (
<Picker
  data={data}
  onEmojiSelect={handleEmojiSelect}
  onClick={() => setEmojiShow(false)}
/>
)}
{selectedEmoji && (
<div>
  <p>Selected Emoji: {selectedEmoji.native}</p>
  <p>Emoji Name: {selectedEmoji.name}</p>
</div>
)} */
}
