"use client";
import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useAuth } from "@/app/context/authContext";

export default function Register({ setActive }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAvatar, setIsAvatar] = useState(false);
  const { setActivationToken } = useAuth();

  const handleRegsiter = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("email", email);
      formdata.append("password", password);
      formdata.append("profilePicture", image);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/register_user`,
        formdata
      );
      if (data) {
        console.log(data);
        setActivationToken(data.activationToken);
        toast.success(data.message);
        setActive("verification");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const avatars = [
    "https://socialface.s3.eu-north-1.amazonaws.com/1721153478512",
    "https://socialface.s3.eu-north-1.amazonaws.com/1721153573105",
    "https://socialface.s3.eu-north-1.amazonaws.com/1721153613401",
    "https://socialface.s3.eu-north-1.amazonaws.com/1721153655218",
    "https://socialface.s3.eu-north-1.amazonaws.com/1721153691010",
    "https://socialface.s3.eu-north-1.amazonaws.com/1721153737044",
    "https://socialface.s3.eu-north-1.amazonaws.com/1721153772964",
    "https://socialface.s3.eu-north-1.amazonaws.com/1721153802309",
    "https://socialface.s3.eu-north-1.amazonaws.com/1721153826601",
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-4 px-4">
      <form
        onSubmit={handleRegsiter}
        className="w-[30rem] py-4 px-2 sm:px-4 bg-gray-100 shadow-md dark:bg-gray-800 rounded-md"
      >
        <div className="flex items-center justify-center flex-col gap-2 w-full">
          <Image src="/Sociallogo3.png" alt="Logo" width={60} height={60} />
          <h2 className=" text-2xl sm:text-3xl font-semibold text-center">
            Welcome to <span className="tgradient">Socialface</span>
          </h2>
          <div className="flex flex-col gap-4 w-full ">
            {/* Avatar */}
            <div className=" relative w-full">
              {/* Default Avatar */}
              {isAvatar && (
                <div className="sm:absolute fixed top-[3rem] right-[1rem] sm:right-[6rem] z-[99] bg-gray-200 dark:bg-gray-700 rounded-md w-[16rem] shadow-md border border-gray-400 py-3 px-4">
                  <span
                    onClick={() => setIsAvatar(false)}
                    className="w-full flex items-center justify-end"
                  >
                    <IoClose className="h-5 w-5 text-gray-900 dark:text-white cursor-pointer" />
                  </span>
                  <div className="grid grid-cols-3 gap-4">
                    {avatars &&
                      avatars.map((item, i) => (
                        <div
                          className={`w-[3rem] h-[3rem] rounded-full overflow-hidden ${
                            image === item && "border-2 border-orange-600"
                          }`}
                          key={i}
                          onClick={() => {
                            setImage(item), setIsAvatar(false);
                          }}
                        >
                          <Image
                            src={item}
                            alt="avatar"
                            layout="responsive"
                            width={49}
                            height={49}
                            className="rounded-full"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/*  */}
              <div
                className="relative w-[3rem] h-[3rem] p-1 rounded-full border overflow-hidden cursor-default border-orange-500"
                onClick={() => setIsAvatar(true)}
              >
                <Image
                  src={!image ? "/profile.png" : image}
                  alt="avatar"
                  fill
                  className="h-[3rem] w-[3rem] "
                />
              </div>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
                id="avatar"
              />
            </div>
            <div className="flex items-center  flex-col sm:flex-row w-full gap-4">
              <div className="relative w-full">
                <FaRegUser className="absolute top-[.6rem] left-2 h-5 w-5  z-10  " />
                <input
                  type="text"
                  placeholder="First name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`${Style.input} pl-8`}
                />
              </div>

              <div className="relative w-full">
                <FaRegUser className="absolute top-[.6rem] left-2 h-5 w-5  z-10  " />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`${Style.input} pl-8`}
                />
              </div>
            </div>
            <div className="relative w-full">
              <MdOutlineAttachEmail className="absolute top-[.7rem] left-2 h-5 w-5  z-10  " />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${Style.input} pl-8`}
              />
            </div>

            <div className="relative w-full">
              <span
                className="absolute top-[.7rem] right-2 cursor-pointer  z-10  "
                onClick={() => setShow(!show)}
              >
                {!show ? (
                  <IoMdEyeOff className="h-6 w-6" />
                ) : (
                  <IoEye className="h-6 w-6" />
                )}
              </span>

              <TbPasswordUser className="absolute top-[.7rem] left-2 h-5 w-5 z-10 " />

              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                className={`${Style.input} pl-8`}
              />
            </div>
            {/* Button */}
            <div className="flex items-center justify-center w-full px-2 sm:px-[2rem]">
              <button type="submit" className={`${Style.button1}`}>
                {loading ? (
                  <BiLoaderCircle className="h-5 w-5 text-white animate-spin" />
                ) : (
                  "Register"
                )}
              </button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className=" w-[7rem] sm:w-full h-[2px] bg-gray-300 rounded-lg" />
              <h6 className="w-full text-center">Or Register with</h6>
              <span className="w-[7rem] sm:w-full  h-[2px] bg-gray-300 rounded-lg" />
            </div>
            {/* Social Auth */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 w-full px-2 sm:px-[2rem]">
              <button className="py-1 px-5  rounded-[2rem] bg-orange-600/10 hover:bg-orange-600/20 transition-all duration-200 flex items-center justify-center gap-1 ">
                <FcGoogle
                  size="30"
                  className="cursor-pointer filter hover:drop-shadow-lg "
                  // onClick={() => signIn("google")}
                />
                Google
              </button>
              <button className="py-1 px-5  rounded-[2rem] bg-orange-600/10 hover:bg-orange-600/20 transition-all duration-200 flex items-center justify-center gap-1 ">
                <AiFillGithub
                  size="30"
                  className="cursor-pointer dark:text-white text-gray-900  filter hover:drop-shadow-lg"
                  // onClick={() => signIn("github")}
                />
                Google
              </button>
            </div>
            {/* No account */}
            <div className="flex items-center justify-center mt-1 gap-2">
              <span className="text-base text-black dark:text-white">
                Already have an account?
              </span>
              <span
                className="text-lg font-medium text-orange-500 hover:text-orange-600 cursor-pointer"
                onClick={() => setActive("login")}
              >
                Login
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
