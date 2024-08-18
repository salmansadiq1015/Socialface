"use client";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function EditProfile({ setIsShow, user, userInfo }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user.email);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(``);

      if (data) {
        toast.success(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="w-full min-h-screen rounded-lg shadow-md mt-4 sm:w-[38rem]  bg-white dark:bg-gray-800 pb-4 ">
      <div className="flex items-center justify-center w-full relative">
        <h3 className="text-[20px] font-semibold text-center"> Edit Profile</h3>
        <span
          className="absolute top-2 right-3 z-10"
          onClick={() => setIsShow(false)}
        >
          <IoIosCloseCircleOutline className="h-6 w-6 text-black dark:text-white  cursor-pointer" />
        </span>
      </div>
      <hr className="w-full h-[1px] bg-gray-400 my-4" />
      <div className="">
        <form
          className="w-full py-2 flex flex-col gap-4 px-4"
          onSubmit={handleUpdate}
        >
          <h3 className="text-[18px] font-semibold py-2">
            Contact & Basic Info
          </h3>
          <div className="inputBox">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-700 dark:border-gray-200 focus:border-gray-700 focus:dark:border-gray-200 valid:dark:border-gray-200 valid:border-gray-700 dark:bg-gray-700 dark:text-white"
            />
            <span className="focus:dark:bg-gray-800 valid:dark:bg-gray-800">
              Email
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
