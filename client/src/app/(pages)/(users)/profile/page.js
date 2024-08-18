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
import EditProfile from "../../../components/user/EditProfile";
import AllUsers from "@/app/components/user/AllUsers";

export default function Profile() {
  const { auth } = useAuth();
  const [cLoading, setCLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [isShow, setIsShow] = useState(false);

  //   Get User Info
  const userInfo = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/user/info/${auth.user._id}`
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
  }, [auth.user]);

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
    setCLoading(true);
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
        setCLoading(false);
        userInfo();
        toast.success("Profile Image updated");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in updating profile image!");
      setCLoading(false);
    }
  };

  const friends = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
  ];

  return (
    <UserLayout>
      <div className="w-full relative min-h-screen  overflow-x-hidden   flex items-start justify-center pb-6 px-0 sm:px-4">
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
              <label
                htmlFor="coverImage"
                className={`absolute bottom-4 right-3 sm:right-6 z-10 flex items-center gap-1 cursor-pointer py-[6px] px-3 rounded-md shadow-md bg-white ${
                  cLoading && "cursor-not-allowed pointer-events-none"
                } `}
                disabled={cLoading}
              >
                {cLoading ? (
                  <TbLoader2 className="text-black h-6 w-6 animate-spin" />
                ) : (
                  <IoIosReverseCamera className="text-black h-6 w-6" />
                )}{" "}
                <span className="text-[13px] font-medium hidden sm:flex text-black">
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
            </div>
            {/* Profile */}
            <div className="flex items-center justify-center sm:justify-between flex-col gap-5 sm:flex-row px-2 sm:px-4">
              <div className="flex items-center flex-col sm:flex-row gap-2">
                <div className=" w-[4.5rem] h-[4.5rem] sm:w-[7.1rem] sm:h-[7.1rem] rounded-full translate-y-[-4rem] border-white border-2 ">
                  <div className="relative w-[4.4rem] h-[4.4rem] sm:w-[7rem] sm:h-[7rem] rounded-full border overflow-hidden ">
                    <Image
                      src={user[0]?.profilePicture}
                      alt="Avatar"
                      layout="fill"
                      className="w-full h-full"
                      priority
                    />
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-3 right-3 cursor-pointer bg-white p-[2px] rounded-md z-10 "
                    >
                      {cLoading ? (
                        <TbLoader2 className="text-black h-6 w-6 animate-spin" />
                      ) : (
                        <IoIosReverseCamera className="text-black h-6 w-6" />
                      )}{" "}
                      <input
                        type="file"
                        accept="image/*"
                        id="profileImage"
                        onChange={(e) => UpdateProfileImage(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1 translate-y-[-4rem] sm:translate-y-[0rem]">
                  <h3 className="text-lg sm:text-2xl font-bold text-center sm:text-start">
                    {user[0]?.firstName + " " + user[0]?.lastName}
                  </h3>
                  <span className="text-[15px] text-center sm:text-start text-gray-600 dark:text-gray-200 font-medium">
                    740 Friends
                  </span>
                  <div className="flex items-center justify-center">
                    {friends.map((img, i) => (
                      <span
                        key={i}
                        className="w-[2.6rem] h-[2.6rem] rounded-full relative overflow-hidden border-2 border-white -ml-2 z-5"
                      >
                        <Image
                          src={img}
                          alt="friends"
                          layout="fill"
                          className="object-contain"
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Edit btn */}
              <div className="">
                <div className=" flex items-center gap-4 translate-y-[-4rem] sm:translate-y-[0rem]">
                  <button
                    className="flex items-center justify-center text-white bg-orange-600 hover:bg-orange-700  h-[2.6rem] px-4  rounded-lg shadow-md hover:shadow-xl transition-all duration-150 cursor-pointer"
                    onClick={() => setIsShow(!isShow)}
                  >
                    <MdModeEdit className="h-5 w-5 text-white" />{" "}
                    <span className="w-[6rem]">Edit Profile</span>
                  </button>
                  {/*  */}
                  <span
                    onClick={() => setShow(!show)}
                    className={`${Style.button1} rounded-lg w-[4rem] `}
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
          {isShow && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/70 z-[9999] px-4 py-6 flex items-center justify-center overflow-y-scroll shidden">
              <EditProfile
                setIsShow={setIsShow}
                user={user[0]}
                userInfo={userInfo}
              />
            </div>
          )}

          {/* All Users */}

          {show && (
            <div className=" py-4 px-4 rounded-md shadow-md bg-gray-100 dark:bg-gray-700 flex flex-col gap-3 border ">
              <span className="text-[17px] font-medium text-black dark:text-white">
                People you may know
              </span>
              <div className="">
                <AllUsers />
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
