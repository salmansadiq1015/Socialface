"use client";
import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineAttachEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

export default function Login({ setActive }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { auth, setAuth } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/login_user`,
        { email, password }
      );
      if (data) {
        setAuth({ ...auth, user: data?.user, token: data?.token });
        localStorage.setItem("auth", JSON.stringify(data));
        console.log(data);
        router.push("/");
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
    <div className="w-full min-h-screen flex items-center justify-center py-4 px-4">
      <form
        onSubmit={handleLogin}
        className="w-[30rem] py-4 px-2 sm:px-4 bg-gray-100 shadow-md dark:bg-gray-800 rounded-md"
      >
        <div className="flex items-center justify-center flex-col gap-2 w-full">
          <Image src="/Sociallogo3.png" alt="Logo" width={60} height={60} />
          <h2 className=" text-2xl sm:text-3xl font-semibold text-center">
            Welcome to <span className="tgradient">Socialface</span>
          </h2>
          <div className="flex flex-col gap-4 w-full mt-4 ">
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
                className="absolute top-[.7rem] right-2   z-10  cursor-pointer "
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
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[14px]">
                <input type="checkbox" /> Remember me
              </span>
              <span
                onClick={() => setActive("resetPassword")}
                className="text-[14px] text-orange-500 hover:text-orange-600 cursor-pointer"
              >
                Forgot Password
              </span>
            </div>
            {/* Button */}
            <div className="flex items-center justify-center w-full py-4 px-2 sm:px-[2rem]">
              <button type="submit" className={`${Style.button1}`}>
                {loading ? (
                  <BiLoaderCircle className="h-5 w-5 text-white animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className=" w-[7rem] sm:w-full h-[2px] bg-gray-300 rounded-lg" />
              <h6 className="w-full text-center">Or Login with</h6>
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
                Not have an account?
              </span>
              <span
                className="text-lg font-medium text-orange-500 hover:text-orange-600 cursor-pointer"
                onClick={() => setActive("register")}
              >
                Register
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
