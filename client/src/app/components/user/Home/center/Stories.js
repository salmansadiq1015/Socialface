import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaCirclePlus } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { Label } from "@headlessui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaPhotoVideo } from "react-icons/fa";

const Stories = ({ user }) => {
  const [show, setShow] = useState(false);
  const [loadStory, setLoadStory] = useState(false);
  const [stories, setStories] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [storyDetail, setStoryDetail] = useState(null);

  console.log("Single Story:", storyDetail);

  // Get All Stories
  const getAllStories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/story/get/stories`
      );
      console.log("Stories:", data);
      if (data) {
        setStories(data.stories);
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    getAllStories();
  }, []);
  // Create Story
  const createStory = async (url, type) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/story/create/story`,
        {
          mediaUrl: url,
          userId: user._id,
          userName: user.firstName + " " + user.lastName,
          profileImage: user.profilePicture,
          mediaType: type,
        }
      );

      if (data?.success) {
        getAllStories();
        toast.success("Story Posted!");
        setShow(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.url);
    }
  };

  // Delete Story
  // const deleteStory = (storyId) => {
  //   try {
  //     axios
  //       .delete(`/stories/${storyId}`)
  //       .then(() =>
  //         setStories(stories.filter((story) => story._id !== storyId))
  //       )
  //       .catch((error) => console.error(error));
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response.data.message);
  //   }
  // };

  // Validate Video
  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration <= 90) {
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

  const UploadStory = async (file) => {
    const maxFileSize = 3 * 1024 * 1024;

    if (file.size > maxFileSize) {
      toast.error("File size must be less than 3 MB");
      return;
    }

    let determinedMediaType = "";

    if (file.type.startsWith("video/")) {
      const isValidDuration = await validateVideoDuration(file);
      if (!isValidDuration) {
        toast.error("Video duration must be less than 60 seconds");
        return;
      }
      determinedMediaType = "Video";
      console.log("Media Type:", "Video");
    } else if (file.type.startsWith("image/")) {
      determinedMediaType = "Image";
      console.log("Media Type:", "Image");
    } else {
      toast.error("Invalid file type");
      return;
    }

    try {
      setLoadStory(true);
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/upload/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Use the media type determined earlier
      console.log("Media Type in upload:", determinedMediaType);
      createStory(data.url, determinedMediaType);
      setLoadStory(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
      setLoadStory(false);
    }
  };

  const filterStory = (id) => {
    const singleStory = stories.filter((story) => story._id === id);
    setStoryDetail(singleStory);
  };

  return (
    <div className="w-full sm:max-w-[38rem] mx-auto ">
      <div className="flex space-x-3 overflow-x-scroll shidden">
        {/* Create Stroey */}
        <div
          className="relative w-40 h-60 flex flex-col gap-1 shadow-md  hover:shadow-lg bg-gray-100 dark:bg-gray-800  transition-all duration-200 cursor-pointer border rounded-lg "
          onClick={() => setShow(true)}
        >
          <div className="relative w-40 h-44  flex-shrink-0  rounded-tl-lg rounded-tr-lg overflow-hidden ">
            <Image
              src={user?.profilePicture}
              layout="fill"
              objectFit="cover"
              alt="Story"
              className="rounded-tl-lg rounded-tr-lg "
            />
          </div>
          <div className="flex items-center flex-col gap-2 justify-center ">
            <span className="border-2 border-white rounded-full translate-y-[-1.2rem] bg-white">
              <FaCirclePlus className="h-8 w-8 text-orange-600 cursor-pointer" />
            </span>
            <span className="text-[14px] font-medium text-black dark:text-white translate-y-[-1.2rem]">
              Create Story
            </span>
          </div>
        </div>
        {/* ------------Stories----------- */}
        {stories &&
          stories?.map((story, i) => (
            <>
              <div
                key={story._id}
                className="relative bg-gray-100 dark:bg-gray-800 w-40 h-60 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 border overflow-hidden rounded-lg cursor-pointer"
                onClick={() => {
                  filterStory(story._id), setShowDetail(true);
                }}
              >
                <div className="absolute top-2 left-2 w-[2.5rem] bg-white dark:bg-gray-800 h-[2.5rem] rounded-full border-2 border-orange-600 overflow-hidden z-20">
                  <Image
                    src={story?.profileImage}
                    alt="Profile"
                    layout="fill"
                    className="rounded-lg"
                    objectFit="cover"
                  />
                </div>
                {story.mediaType === "Image" ? (
                  <Image
                    src={story?.mediaUrl}
                    layout="fill"
                    objectFit="cover"
                    alt="Story"
                    className="rounded-lg"
                  />
                ) : (
                  <video
                    src={story?.mediaUrl}
                    // controls
                    className="rounded-lg w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 p-2 bg-gradient-to-t from-black to-transparent text-white rounded-b-lg">
                  <p className="text-xs">{story.userName}</p>
                </div>
              </div>
            </>
          ))}
      </div>

      {/* Upload Story Modal */}

      {show && (
        <div className="fixed top-0 left-0 w-full h-full z-[9999] bg-white/90 dark:bg-black/80 flex items-center justify-center py-2 px-3 sm:px-4">
          <span
            className="absolute top-2 right-3 z-10"
            onClick={() => setShow(false)}
          >
            <IoCloseCircle className="h-7 w-7 text-gray-500 dark:text-white cursor-pointer" />
          </span>
          <div
            disabled={loadStory}
            className={`w-[18rem] h-[20rem]  sm:h-[22rem] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer bgGradient ${
              loadStory && "pointer-events-none"
            }`}
          >
            <label
              htmlFor="uploadStory"
              className="w-full h-full flex items-center justify-center flex-col gap-3 "
            >
              <input
                type="file"
                id="uploadStory"
                accept="image/*,video/*"
                onChange={(e) => UploadStory(e.target.files[0])}
                className="hidden"
              />
              <span className="p-2 rounded-full bg-white shadow-md">
                <FaPhotoVideo className="h-7 w-7 text-black" />
              </span>
              <h3 className="text-[15px] font-medium text-white">
                {loadStory ? "Story Post..." : "Create a Story"}
              </h3>
            </label>
          </div>
        </div>
      )}

      {/* Show Story Details */}
      {showDetail && (
        <div className="fixed top-0 left-0 w-full h-full z-[9999] bg-white/90 dark:bg-black/80 flex items-center justify-center py-2 px-3 sm:px-4">
          <span
            className="absolute top-2 right-3 z-10"
            onClick={() => setShowDetail(false)}
          >
            <IoCloseCircle className="h-7 w-7 text-gray-500 dark:text-white cursor-pointer" />
          </span>
          {/* -------- */}
          <div className="relative w-[21rem] sm:w-[35rem] h-[25rem] mt-4 sm:mt-0 sm:h-[21rem] flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="absolute top-2 left-2 w-[2.5rem] bg-white dark:bg-gray-800 h-[2.5rem] rounded-full border-2 border-orange-600 overflow-hidden z-20">
              <Image
                src={storyDetail[0]?.profileImage}
                alt="Profile"
                layout="fill"
                className="rounded-lg"
                objectFit="cover"
              />
            </div>
            {storyDetail[0]?.mediaType === "Image" ? (
              <Image
                src={storyDetail[0]?.mediaUrl}
                layout="fill"
                // objectFit="cover"
                alt="Story"
                className="rounded-lg"
              />
            ) : (
              <video
                src={storyDetail[0]?.mediaUrl}
                controls
                autoPlay
                className="rounded-lg w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 p-2 bg-gradient-to-t from-black to-transparent text-white rounded-b-lg">
              <p className="text-xs">{storyDetail[0]?.userName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
