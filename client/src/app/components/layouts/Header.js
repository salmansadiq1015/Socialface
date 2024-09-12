"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { FiHome } from "react-icons/fi";
import { PiVideo } from "react-icons/pi";
import { FaUsersRectangle } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import { FaShopLock } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { FaFacebookMessenger } from "react-icons/fa";
import { CgMenuGridR } from "react-icons/cg";
import { IoSettings } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa6";
import { IoSunny } from "react-icons/io5";
import { IoMoon } from "react-icons/io5";
import { BsDoorOpenFill } from "react-icons/bs";
import { useAuth } from "@/app/context/authContext";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { MdFeedback } from "react-icons/md";
import ThemeSwitcher from "@/app/utils/ThemeSwitcher";
import toast from "react-hot-toast";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { MdOndemandVideo } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";

// const products = [
//   {
//     name: "Analytics",
//     description: "Get a better understanding of your traffic",
//     href: "#",
//     icon: ChartPieIcon,
//   },
//   {
//     name: "Engagement",
//     description: "Speak directly to your customers",
//     href: "#",
//     icon: CursorArrowRaysIcon,
//   },
//   {
//     name: "Security",
//     description: "Your customers’ data will be safe and secure",
//     href: "#",
//     icon: FingerPrintIcon,
//   },
//   {
//     name: "Integrations",
//     description: "Connect with third-party tools",
//     href: "#",
//     icon: SquaresPlusIcon,
//   },
//   {
//     name: "Automations",
//     description: "Build strategic funnels that will convert",
//     href: "#",
//     icon: ArrowPathIcon,
//   },
// ];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [buy, setBuy] = useState("false");
  const { auth, user, setAuth, isActive, setIsActive } = useAuth();
  const [show, setShow] = useState(false);
  const router = useRouter();
  const headerManu = useRef(null);

  const handleLogout = () => {
    router.push("/authentication");
    localStorage.removeItem("auth");
    setAuth({ ...auth, user: null, token: "" });
    toast.success("Logout successfully!");
  };

  // Close Timer Status to click anywhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerManu.current && !headerManu.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header className="  bg-gray-100 dark:bg-black fixed top-0 left-0 w-full z-[999] border-b border-gray-200 dark:border-gray-400">
      <nav
        aria-label="Global"
        className="mx-auto flex flex-col sm:flex-row max-w-7xl items-center justify-between p-[1px] lg:px-8"
      >
        {/* ---------Mobile Nav Button------ */}
        <div className="flex sm:hidden items-center w-full justify-between ">
          <div className="flex items-center">
            <Link href="/" className="-m-1.5 p-1.5">
              <h1 className="text-xl font-bold ml-2 tgradient">SocialFace</h1>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-full  bg-gray-500/20
            `}
            >
              <IoSearchOutline
                className={`h-5 w-5 ${
                  isActive === 5
                    ? "text-orange-600"
                    : "text-gray-950 dark:text-gray-100"
                }`}
              />
            </span>
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="mx-auto flex  w-full items-center justify-between p-[3px] lg:px-8">
          {/* 1 */}
          <div className="hidden sm:flex items-center">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <div className="relative w-[2.6rem] h-[2.6rem] sm:w-[2.9rem] sm:h-[2.9rem] ">
                <Image
                  alt=""
                  fill
                  src="/Sociallogo2.png"
                  className="h-8 sm:h-8 w-auto"
                />
              </div>
            </Link>
            <span
              className={`p-[3px] rounded-full ml-6 cursor-pointer ${
                isActive === 5 ? " bg-orange-600/20 " : "bg-gray-500/20"
              }`}
              title="Search"
            >
              <IoSearchOutline
                className={`h-5 w-5 ${
                  isActive === 5
                    ? "text-orange-600"
                    : "text-gray-950 dark:text-gray-100"
                }`}
              />
            </span>

            {/* ----------------Search------------- */}
            {/* <div className="">
              <form action="">
                <div className="relative w-full">
                  <IoSearchOutline className="h-5 w-5 text-orange-600 absolute top-[.7rem] cursor-pointer left-[.8rem] " />
                  <input
                    type="search"
                    className="w-full h-[2.5rem] pl-[2rem] pr-2 rounded-[1.5rem] outline-none border bg-orange-500/10 focus:border-orange-600"
                  />
                </div>
              </form>
            </div> */}
          </div>
          {/*  */}

          {/* 2 */}
          <div className="flex items-center gap-3 sm:gap-8 px-4">
            <span
              onClick={() => {
                router.push("/"), setIsActive(1);
              }}
              className={`p-2 rounded-full sm:py-2 sm:rounded-none  ${
                isActive === 1
                  ? " bg-orange-600/20 sm:bg-transparent sm:border-b-[2px] sm:border-orange-600 "
                  : "bg-transparent"
              }`}
            >
              <FiHome
                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  isActive === 1
                    ? "text-orange-600"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              />
            </span>

            <span
              onClick={() => {
                router.push("/watch"), setIsActive(2);
              }}
              className={`p-2 rounded-full sm:py-2 sm:rounded-none  ${
                isActive === 2
                  ? " bg-orange-600/20 sm:bg-transparent sm:border-b-[2px] sm:border-orange-600 "
                  : "bg-transparent"
              }`}
            >
              <PiVideo
                className={`h-6 w-6 sm:h-7 sm:w-7  ${
                  isActive === 2
                    ? "text-orange-600"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              />
            </span>

            <span
              onClick={() => setIsActive(3)}
              className={`p-2 rounded-full sm:py-2 sm:rounded-none  ${
                isActive === 3
                  ? " bg-orange-600/20 sm:bg-transparent sm:border-b-[2px] sm:border-orange-600 "
                  : "bg-transparent"
              }`}
            >
              <FaUsersRectangle
                className={`h-6 w-6 sm:h-7 sm:w-7  ${
                  isActive === 3
                    ? "text-orange-600"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              />
            </span>

            <span
              onClick={() => setIsActive(4)}
              className={`p-2 rounded-full sm:py-2 sm:rounded-none  ${
                isActive === 4
                  ? " bg-orange-600/20 sm:bg-transparent sm:border-b-[2px] sm:border-orange-600 "
                  : "bg-transparent"
              }`}
            >
              {buy ? (
                <FaShop
                  className={`h-5 w-5 sm:h-7 sm:w-7 ${
                    isActive === 4
                      ? "text-orange-600"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                />
              ) : (
                <FaShopLock
                  className={`h-5 w-5 sm:h-7 sm:w-7  ${
                    isActive === 4
                      ? "text-orange-600"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                />
              )}
            </span>
          </div>

          {/* 3 Profile */}
          <div className=" flex items-center justify-center gap-2">
            <div className="flex items-center gap-3 sm:gap-4 py-[3px] ">
              <span
                onClick={() => setIsActive(5)}
                className={`p-2 hidden sm:flex rounded-full ${
                  isActive === 5 ? " bg-orange-600/20 " : "bg-gray-500/20"
                }`}
              >
                <CgMenuGridR
                  className={` h-5 w-5 sm:h-6 sm:w-6 ${
                    isActive === 5
                      ? "text-orange-600"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                />
              </span>
              <span
                onClick={() => setIsActive(6)}
                className={`p-2 rounded-full ${
                  isActive === 6 ? " bg-orange-600/20 " : "bg-gray-500/20"
                }`}
              >
                <FaFacebookMessenger
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    isActive === 6
                      ? "text-orange-600"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                />
              </span>
              {/* Notifications */}
              <span
                onClick={() => setIsActive(7)}
                className={`p-2 relative rounded-full ${
                  isActive === 7 ? " bg-orange-600/20 " : "bg-gray-500/20"
                }`}
              >
                <span className=" absolute top-[-.3rem] right-[-.3rem] z-[99] h-[1.2rem] w-[1.2rem] flex items-center justify-center  rounded-full text-white bg-orange-600  text-[.7rem]">
                  30
                </span>
                <IoIosNotifications
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    isActive === 7
                      ? "text-orange-600"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                />
              </span>
            </div>
            {/*  */}
            <div className="w-[3.1rem] h-[3.1rem] relative hidden sm:block">
              <div
                className={`relative ml-[2rem] w-[3rem] h-[3rem] cursor-pointer   rounded-full overflow-hidden border-2 ${
                  isActive === 8 && show && "border-orange-600"
                } `}
                onClick={() => {
                  setShow(!show), setIsActive(8);
                }}
              >
                <Image
                  src={user ? user?.profilePicture : auth?.user?.profilePicture}
                  alt=""
                  layout="fill"
                  className="w-full h-full"
                />
              </div>
              {/* Side POPUp */}
              {show && (
                <div
                  ref={headerManu}
                  className="fixed hidden sm:block  top-[4rem] border right-[1rem] w-[22rem] rounded-md shadow-md py-4 px-4 bg-gray-100 dark:bg-gray-900 z-[99]"
                >
                  <Link
                    href={`/profile/${auth?.user?._id}`}
                    className=" cursor-pointer w-full py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 bg-white dark:bg-gray-800  mt-2 flex items-center gap-2"
                  >
                    <div className="relative w-[3rem] h-[3rem] rounded-full border-[2px] border-orange-600 cursor-pointer overflow-hidden ">
                      <Image
                        src={
                          user
                            ? user?.profilePicture
                            : auth?.user?.profilePicture
                        }
                        alt="Avatar"
                        layout="fill"
                        className="h-8 w-full "
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[17px] font-medium">
                        {user
                          ? user?.firstName + " " + user?.lastName
                          : auth?.user?.firstName + " " + auth?.user?.lastName}
                      </h4>
                      <span className="text-[16px] text-gray-600 dark:text-gray-200">
                        View your profile
                      </span>
                    </div>
                  </Link>
                  {/*  */}
                  <hr className="w-full h-[2px] bg-gray-300 my-5" />
                  {/*  */}
                  <div className="mt-2 space-y-2">
                    <Link
                      href="#"
                      className="flex items-center gap-4 py-3 font-medium border shadow px-3 cursor-pointer hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-gray-800/10 rounded-lg dark:bg-gray-800"
                    >
                      <FaUserCircle className=" h-6 w-6 text-gray-800 dark:text-gray-100 cursor-pointer" />{" "}
                      Settings
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-4 py-3 font-medium border shadow px-3 cursor-pointer hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-gray-800/10  rounded-lg dark:bg-gray-800"
                    >
                      <FaCcMastercard className=" h-6 w-6 text-gray-800 dark:text-gray-100 cursor-pointer" />{" "}
                      Orders & Payments
                    </Link>
                    <span className="flex items-center gap-4 py-3 border shadow font-medium px-3 cursor-pointer hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-gray-800/10  rounded-lg dark:bg-gray-800">
                      <ThemeSwitcher />
                      Dark mode
                    </span>
                    <Link
                      href="#"
                      className="flex items-center gap-4 py-3 font-medium border shadow px-3 cursor-pointer hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-gray-800/10  rounded-lg dark:bg-gray-800"
                    >
                      <BsFillQuestionCircleFill className=" h-6 w-6 text-gray-800 dark:text-gray-100 cursor-pointer" />{" "}
                      Help & Support
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-4 py-3 font-medium border shadow px-3 cursor-pointer hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-gray-800/10  rounded-lg dark:bg-gray-800"
                    >
                      <MdFeedback className=" h-6 w-6 text-gray-800 dark:text-gray-100 cursor-pointer" />{" "}
                      Give Feedback
                    </Link>
                    <span
                      onClick={handleLogout}
                      className="flex items-center gap-4 py-3 border shadow font-medium px-3 cursor-pointer hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-gray-800/10  rounded-lg dark:bg-gray-800"
                    >
                      <BsDoorOpenFill className=" h-6 w-6 text-gray-800 dark:text-gray-100 cursor-pointer" />{" "}
                      Logout
                    </span>
                  </div>

                  {/*  */}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* --------------Mobile Screen------------ */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-[9999]" />
        <DialogPanel className="fixed inset-y-0 right-0 z-[9999] w-full overflow-y-auto bg-white dark:bg-gray-900 dark:text-white text-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <div className="relative w-[3rem] h-[3rem] ">
                <Image
                  alt=""
                  fill
                  src="/Sociallogo2.png"
                  className="h-8 w-auto"
                />
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-white"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          {/* ----------Content------- */}
          {/* Profile */}
          <Link
            href={"/profile"}
            className=" cursor-pointer w-full py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 bg-gray-100 dark:bg-gray-800 dark:text-white text-black  mt-2 flex items-center gap-2"
          >
            <div className="relative w-[3rem] h-[3rem] rounded-full border-[2px] border-orange-600 cursor-pointer overflow-hidden ">
              <Image
                src={user ? user?.profilePicture : auth?.user?.profilePicture}
                alt="Avatar"
                layout="fill"
                className="h-8 w-full "
              />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[17px] font-medium">
                {user
                  ? user?.firstName + " " + user?.lastName
                  : auth?.user?.firstName + " " + auth?.user?.lastName}
              </h4>
              <span className="text-[16px] text-gray-600 dark:text-gray-200">
                View your profile
              </span>
            </div>
          </Link>
          {/*  */}
          <hr className="w-full h-[2px] bg-gray-300 dark:bg-gray-800 dark:text-white text-black  my-5" />
          <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => router.push("/watch")}
                className="flex flex-col gap-2 rounded-md py-4 shadow hover:shadow-md cursor-pointer items-center justify-center bg-gray-50 dark:bg-slate-700 "
              >
                <span>
                  <MdOndemandVideo className="h-6 w-6 text-orange-600" />
                </span>
                <span className="text-center">Videos</span>
              </div>
              <div
                onClick={() => router.push("/messages")}
                className="flex flex-col gap-2 rounded-md py-4 shadow hover:shadow-md cursor-pointer items-center justify-center bg-gray-50 dark:bg-slate-700 "
              >
                <span>
                  <FaFacebookMessenger className="h-6 w-6 text-pink-600" />
                </span>
                <span className="text-center">Messages</span>
              </div>
              {/*  */}
              <div
                onClick={() => router.push("/friends")}
                className="flex flex-col gap-2 rounded-md py-4 shadow hover:shadow-md cursor-pointer items-center justify-center bg-gray-50 dark:bg-slate-700 "
              >
                <span>
                  <HiUserGroup className="h-6 w-6 text-sky-600" />
                </span>
                <span className="text-center">Friends</span>
              </div>
            </div>
            <Disclosure as="div" className="-mx-3">
              <DisclosureButton className="group flex w-full items-center  dark:bg-gray-800 dark:text-white justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                <span className=" flex items-center gap-4  dark:text-white text-black ">
                  {" "}
                  <IoSettings className="h-5 w-5 text-gray-800 dark:text-gray-100 cursor-pointer" />
                  Settings & privacy
                </span>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                />
              </DisclosureButton>
              <DisclosurePanel className="mt-2 space-y-2">
                <Link
                  href="#"
                  className="flex items-center gap-4 py-3 font-medium px-3 cursor-pointer shadow-md hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-orange-600/20 rounded-lg dark:bg-gray-800"
                >
                  <FaUserCircle className=" h-6 w-6 text-gray-800 dark:text-gray-100 cursor-pointer" />{" "}
                  Settings
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 py-3 font-medium px-3 cursor-pointer shadow-md hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-orange-600/20 rounded-lg dark:bg-gray-800"
                >
                  <FaCcMastercard className=" h-6 w-6 text-gray-800 dark:text-gray-100 cursor-pointer" />{" "}
                  Orders & Payments
                </Link>
                <span className="flex items-center gap-4 py-3 font-medium px-3 cursor-pointer shadow-md hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-orange-600/20 rounded-lg dark:bg-gray-800">
                  <ThemeSwitcher />
                  Dark mode
                </span>
                <span
                  onClick={handleLogout}
                  className="flex items-center gap-4 py-3 border shadow font-medium px-3 cursor-pointer hover:shadow-lg transition-all duration-150 bg-gray-100 hover:bg-gray-800/10  rounded-lg dark:bg-gray-800"
                >
                  <BsDoorOpenFill className=" h-6 w-6 text-gray-800 dark:text-gray-100 cursor-pointer" />{" "}
                  Logout
                </span>
              </DisclosurePanel>
            </Disclosure>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
