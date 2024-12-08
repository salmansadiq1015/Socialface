"use client";
import UserLayout from "@/app/components/layouts/UserLayout";
import { useAuth } from "@/app/context/authContext";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosReverseCamera } from "react-icons/io";
import { TbLoader2 } from "react-icons/tb";
import { MdModeEdit } from "react-icons/md";
import { Style } from "@/app/utils/CommonStyle";
import { BiChevronUp } from "react-icons/bi";
import { BiChevronDown } from "react-icons/bi";
import AllUsers from "@/app/components/user/AllUsers";
import EditProfile from "@/app/components/user/EditProfile";
import { AnimatePresence, motion } from "framer-motion";

export default function Profile({ params }) {
  const userId = params.id;
  const { auth, allContacts } = useAuth();
  const [cLoading, setCLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [friends, setFriends] = useState([]);
  console.log("auth", user[0], allContacts, friends);

  //   Get User Info
  const userInfo = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/user/info/${userId}`
      );
      setUser(data.user);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    userInfo();
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    if (allContacts && user) {
      const friendList = allContacts?.filter((item) =>
        user[0]?.following?.includes(item._id)
      );
      setFriends(friendList);
    } else {
      setFriends([]);
    }
  }, [allContacts, user]);

  //   Update CoverImage

  const UpdateCoverImage = async (file) => {
    setCLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/update/coverImage/${auth.user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data) {
        setCLoading(false);
        userInfo();
        toast.success("Cover Image updated");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in updating cover image!");
      setCLoading(false);
    }
  };

  //   Handle Profile Image

  const UpdateProfileImage = async (file) => {
    setIsloading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/update/profileImage/${auth.user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data) {
        userInfo();
        toast.success("Profile Image updated");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in updating profile image!");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <UserLayout>
      <div className="w-full relative h-[100%]  overflow-x-hidden  overflow-y-auto shidden flex items-start justify-center pb-6 px-0 sm:px-4">
        <div className="flex flex-col gap-4 w-[21rem] sm:w-[45rem] md:w-[60rem] ">
          <div className=" relative flex flex-col gap-4 w-[21rem] sm:w-[45rem] md:w-[60rem] shidden overflow-y-scroll  ">
            {/* Cover Image */}
            <div className="w-full  relative ">
              <div className="w-[21rem] sm:w-[45rem] md:w-[60rem] h-[13rem] sm:h-[20rem] relative rounded-bl-lg rounded-br-lg overflow-hidden">
                <Image
                  src={user[0]?.coverPhoto}
                  alt="Cover"
                  layout="fill"
                  className="w-[22rem] sm:w-[55rem] h-[16rem] sm:h-[20rem]"
                  priority
                />
              </div>
              {userId === auth?.user?._id && (
                <label
                  htmlFor="coverImage"
                  className={`absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-10 flex items-center gap-1 cursor-pointer p-1 sm:p-0 sm:py-[6px] sm:px-3 rounded-md shadow-md bg-white dark:bg-slate-800/70  ${
                    cLoading && "cursor-not-allowed pointer-events-none"
                  } `}
                  disabled={cLoading}
                >
                  {cLoading ? (
                    <TbLoader2 className="text-black dark:text-white h-6 w-6 animate-spin" />
                  ) : (
                    <IoIosReverseCamera className="text-black dark:text-white h-6 w-6" />
                  )}{" "}
                  <span className="text-[13px] font-medium hidden sm:flex text-black dark:text-white">
                    Edit cover Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    id="coverImage"
                    onChange={(e) => UpdateCoverImage(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {/* Profile */}
            <div className="flex items-center justify-center sm:justify-between flex-col gap-5 sm:flex-row px-2 sm:px-4">
              <div className="flex items-center flex-col sm:flex-row gap-2">
                <div className=" w-[4.5rem] h-[4.5rem] sm:w-[7.1rem] sm:h-[7.1rem] rounded-full translate-y-[-4rem]  ">
                  <div className="relative w-[4.4rem] h-[4.4rem] sm:w-[7rem] sm:h-[7rem] rounded-full ring-2 ring-white dark:ring-slate-200">
                    <Image
                      src={
                        user[0]?.profilePicture
                          ? user[0]?.profilePicture
                          : "/profile.png"
                      }
                      alt="Avatar"
                      layout="fill"
                      className="w-full h-full rounded-full"
                      priority
                    />
                    {userId === auth?.user?._id && (
                      <label
                        htmlFor="profileImage"
                        className="absolute bottom-1 right-1 cursor-pointer bg-white p-[2px] rounded-md z-[99] "
                      >
                        {isloading ? (
                          <TbLoader2 className="text-black h-5 w-5 animate-spin" />
                        ) : (
                          <IoIosReverseCamera className="text-black h-5 w-5 " />
                        )}{" "}
                        <input
                          type="file"
                          accept="image/*"
                          id="profileImage"
                          onChange={(e) =>
                            UpdateProfileImage(e.target.files[0])
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 translate-y-[-4rem] sm:translate-y-[0rem]">
                  <h3 className="text-lg sm:text-2xl font-bold text-center sm:text-start">
                    {`${user[0]?.firstName}  ${
                      user[0]?.lastName ? user[0]?.lastName : ""
                    }`}
                  </h3>
                  <span className="text-[15px] text-center sm:text-start text-gray-600 dark:text-gray-200 font-medium">
                    {user[0]?.followers?.length > 0
                      ? user[0]?.followers?.length
                      : "No"}{" "}
                    Friends
                  </span>
                  <div className="flex items-center justify-center">
                    {friends?.slice(0, 6).map((user) => (
                      <div
                        key={user._id}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={`${user?.firstName}  ${
                          user?.lastName ? user?.lastName : ""
                        }`}
                        className="relative w-[2.3rem] h-[2.3rem] rounded-full bg-blue-500 ring-2 ring-orange-50 dark:ring-gray-700 hover:ring-orange-500  transform hover:scale-[1.1] hover:z-10 transition duration-300 ease-in-out"
                      >
                        <Image
                          src={user?.profilePicture}
                          alt="Avatar"
                          layout="fill"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Edit btn */}
              <div className="">
                <div className=" flex items-center gap-4 translate-y-[-4rem] sm:translate-y-[0rem]">
                  <button
                    className="flex items-center justify-center text-white bg-orange-600 hover:bg-orange-700  h-[2.4rem] px-4  rounded-lg shadow-md hover:shadow-xl transition-all duration-150 cursor-pointer"
                    onClick={() => setIsShow(!isShow)}
                  >
                    <MdModeEdit className="h-5 w-5 text-white" />{" "}
                    <span className="w-[6rem]">Edit Profile</span>
                  </button>
                  {/*  */}
                  <span
                    onClick={() => setShow(!show)}
                    className={`${Style.button1}  rounded-lg w-[4rem] `}
                    style={{ height: "2.4rem" }}
                  >
                    {show ? (
                      <BiChevronUp className="h-7 w-7 text-white" />
                    ) : (
                      <BiChevronDown className="h-7 w-7 text-white" />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Edit Profile */}
          <AnimatePresence>
            {isShow && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 w-full h-full bg-black/70 z-[9999] px-4 py-6 flex items-center justify-center overflow-y-scroll"
              >
                <EditProfile
                  setIsShow={setIsShow}
                  user={user[0]}
                  userInfo={userInfo}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* All Users */}

          {show && (
            <div className=" py-4 px-4 rounded-md shadow-md bg-gray-100 dark:bg-slate-800/70 flex flex-col gap-3 border dark:border-slate-700 ">
              <span className="text-[17px] font-medium text-black dark:text-white">
                People you may know
              </span>
              <div className="">
                <AllUsers usersData={allContacts} user={user[0]} />
              </div>
            </div>
          )}

          {/* HR */}
          <hr className="w-full h-[1px] bg-gray-400 my-4" />
        </div>
      </div>
    </UserLayout>
  );
}
