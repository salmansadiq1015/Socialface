import { useAuth } from "@/app/context/authContext";
import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsShieldLockFill } from "react-icons/bs";
import { CgSpinnerTwo } from "react-icons/cg";
import { FaGlobe } from "react-icons/fa";
import { PiBagSimpleFill } from "react-icons/pi";
import { FaGraduationCap } from "react-icons/fa6";
import { TbHomeFilled } from "react-icons/tb";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import {
  FaUserAlt,
  FaHeart,
  FaUsers,
  FaHandshake,
  FaRegSadTear,
} from "react-icons/fa";
import EditDetail from "./EditDetail";
import CreatePost from "../user/Home/center/CreatePost";
import Posts from "../user/Home/center/Posts";

export default function Poststab({
  userId,
  user,
  posts,
  postloading,
  allUserPost,
}) {
  const { auth, setAuth } = useAuth();
  const [isEditDetail, setIsEditDetail] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);
  const closeEditDetail = useRef(null);
  const [bio, setBio] = useState(() =>
    auth?.user?._id === userId ? auth?.user?.bio : user?.bio
  );
  const [about, setAbout] = useState(
    auth?.user?._id === userId ? auth?.user?.about : user?.about
  );

  const website =
    auth?.user?._id === userId ? auth?.user?.website : user?.website;
  const work =
    auth?.user?._id === userId ? auth?.user?.about?.work : user?.about?.work;
  const education =
    auth?.user?._id === userId
      ? auth?.user?.about?.education
      : user?.about?.education;
  const liveIn =
    auth?.user?._id === userId
      ? auth?.user?.about?.liveIn
      : user?.about?.liveIn;
  const relationshipStatus =
    auth?.user?._id === userId
      ? auth?.user?.about?.relationshipStatus
      : user?.about?.relationshipStatus;
  const phoneNumber =
    auth?.user?._id === userId
      ? auth?.user?.about?.phoneNumber
      : user?.about?.phoneNumber;
  const [loading, setLoading] = useState(false);

  console.log("UPosts:", posts);

  //--------- Loacked Profile--------------->
  const lockProfileHandler = async (userid, lockProfile) => {
    if (!userid) {
      return;
    }

    console.log(userid, lockProfile);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/profile_lock/${userid}`,
        { lockProfile }
      );
      const updateAuthData = {
        user: data.user,
        token: auth.token,
      };

      localStorage.setItem("auth", JSON.stringify(updateAuthData));

      // Update the auth state
      setAuth({ ...auth, user: data.user, token: auth.token });
      if (data) {
        // getUserDetail(auth.user._id);
        toast.success(lockProfile ? "Profile locked!" : "Profile unlocked!", {
          // position: "bottom-left",
        });
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  // -------Handel Edit Bio-------->
  const handleEditBio = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/update/userProfile/${userId}`,
        { bio }
      );
      if (data) {
        const updateAuthData = {
          user: data.userData,
          token: auth.token,
        };
        localStorage.setItem("auth", JSON.stringify(updateAuthData));

        // Update the auth state
        setAuth({ ...auth, user: data.user, token: auth.token });
        toast.success("Bro updated!");
        setShowEditBio(false);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Relation
  const renderRelationshipIcon = (status) => {
    switch (status) {
      case "Single":
        return <FaHeart className="h-5 w-5 text-red-500" />;
      case "In a relationship":
        return <FaUserAlt className="h-5 w-5 text-blue-500" />;
      case "Married":
        return <FaHandshake className="h-5 w-5 text-green-500" />;
      case "Divorced":
        return <FaRegSadTear className="h-5 w-5 text-gray-500" />;
      case "Complicated":
        return <FaUsers className="h-5 w-5 text-yellow-500" />;
      default:
        return <FaUserAlt className="h-5 w-5 text-gray-500" />;
    }
  };

  // Close Detail Modal to click any where
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        closeEditDetail.current &&
        !closeEditDetail.current.contains(event.target)
      ) {
        setIsEditDetail(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-4 max-h-[100vh] overflow-y-auto shidden">
        <div className="col-span-5 sm:col-span-2 p-2">
          <div className="w-full flex flex-col gap-4">
            <>
              {(
                auth?.user?._id === userId
                  ? auth?.user?.lockProfile
                  : user?.lockProfile
              ) ? (
                <div className="flex items-center gap-4 p-4 rounded-lg border dark:border-slate-700 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 transition-all  ">
                  {/* Icon */}
                  <span className="flex items-center justify-center rounded-full shadow-lg p-3 bg-gradient-to-tr from-orange-400 to-orange-500 text-white transition-all transform hover:rotate-6">
                    <BsShieldLockFill className="h-6 w-6" />
                  </span>

                  {/* Content */}
                  <div className="flex flex-col gap-1">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {auth?.user?._id === userId
                        ? `You've locked your profile`
                        : `${user?.firstName} locked his profile`}
                    </span>
                    <Link
                      href="#"
                      className="text-sm font-medium text-orange-500 hover:text-orange-600 cursor-pointer"
                    >
                      Learn more
                    </Link>
                    {auth?.user?._id === userId && (
                      <button
                        className={`${Style.button1} mt-2 px-4 py-1 bg-orange-500 text-white rounded-md shadow-md transition-all transform hover:bg-orange-600 hover:scale-105`}
                        onClick={() => lockProfileHandler(auth.user._id, false)}
                      >
                        Unlock Profile
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {auth?.user?._id === userId && (
                    <div className="flex items-center gap-4 p-4 rounded-lg shadow-lg bg-gradient-to-br from-white to-gray-50 border dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 transition-all ">
                      {/* Icon */}
                      <span className="flex items-center justify-center rounded-full shadow-lg p-3 bg-gradient-to-tr from-green-400 to-green-500 text-white transition-all transform hover:rotate-6">
                        <BsShieldLockFill className="h-6 w-6" />
                      </span>

                      {/* Content */}
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          Your profile is unlocked
                        </span>
                        <Link
                          href="#"
                          className="text-sm font-medium text-green-500 hover:text-green-600 cursor-pointer"
                        >
                          Learn more
                        </Link>

                        <button
                          className={`${Style.button1} mt-2 px-4 py-1 bg-green-500 text-white rounded-md shadow-md transition-all transform hover:bg-green-600 hover:scale-105`}
                          onClick={() =>
                            lockProfileHandler(auth.user._id, true)
                          }
                        >
                          Lock Profile
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
            {/* ----- Intro------- */}

            <div className="flex items-center flex-col gap-4 p-4 rounded-lg border dark:border-slate-700 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 transition-all  ">
              <h2 className="text-xl font-semibold text-start w-full">Intro</h2>
              <div className="flex flex-col gap-4 w-full">
                <>
                  {showEditBio ? (
                    <form
                      onSubmit={handleEditBio}
                      className="flex flex-col  w-full"
                    >
                      <textarea
                        maxLength={180}
                        value={bio}
                        placeholder="Tell us a bit about yourself..."
                        onChange={(e) => setbio(e.target.value)}
                        className="h-[7rem] rounded-md border border-gray-400 dark:border-gray-700 resize-none bg-transparent focus:border-orange-500 p-2 outline-none"
                      ></textarea>
                      <div className="flex items-center justify-end">
                        <span className="text-gray-500 font-normal text-[13px]">
                          {180 - bio?.length || 0} characters remaining
                        </span>
                      </div>
                      <div className="flex items-center justify-end mt-3">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setShowEditBio(false)}
                            className="px-4 w-full py-2 text-[13px] font-normal text-white rounded-md shadow-md transition-all transform bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 hover:scale-[1.02] hover:shadow-md"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 w-full py-2 text-[13px]  font-normal text-white rounded-md shadow-md transition-all transform bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 hover:scale-[1.02] hover:shadow-md"
                          >
                            {loading ? (
                              <CgSpinnerTwo className="h-4 w-4 text-white" />
                            ) : (
                              "Save"
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      {(auth?.user?._id === userId
                        ? auth?.user?.bio
                        : user?.bio) && (
                        <div className="h-fit min-h-[7rem] w-full rounded-md border border-gray-200 dark:border-gray-700 resize-none bg-transparent p-2 outline-none drop-shadow-md">
                          <p className="text-justify text-[15px] h-fit overflow-hidden">
                            {auth?.user?._id === userId
                              ? auth?.user?.bio
                              : user?.bio}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </>
                {bio?.length > 0 ? (
                  <button
                    onClick={() => setShowEditBio(true)}
                    className="px-4 w-full py-2 font-medium text-white rounded-md shadow-md transition-all transform bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 hover:scale-[1.02] hover:shadow-md"
                  >
                    Edit Bio
                  </button>
                ) : (
                  <button
                    onClick={() => setShowEditBio(true)}
                    className="px-4 w-full py-2 font-medium text-white rounded-md shadow-md transition-all transform bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 hover:scale-[1.02] hover:shadow-md"
                  >
                    Add Bio
                  </button>
                )}
              </div>
              {/*  */}
              <div className="flex flex-col items-start gap-1 w-full ">
                {website && (
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={"Website"}
                    className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-all duration-300 hover:scale-[1.02] "
                  >
                    <span className="p-2 bg-white/20 rounded-full flex items-center justify-center hover:animate-spin">
                      <FaGlobe className="h-5 w-5 transition-all duration-300" />
                    </span>
                    <Link
                      href={website}
                      className="text-[13px] font-medium cursor-pointer hover:underline transition-all duration-300"
                    >
                      {website}
                    </Link>
                  </div>
                )}
                {work && (
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={"Work"}
                    className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-all duration-300 hover:scale-[1.02] "
                  >
                    <span className="p-2 bg-white/20 rounded-full flex items-center justify-center ">
                      <PiBagSimpleFill className="h-6 w-6 transition-all duration-300" />
                    </span>
                    <span className="text-[13px] font-medium cursor-pointer hover:underline transition-all duration-300">
                      {work}
                    </span>
                  </div>
                )}
                {education && (
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={"Education"}
                    className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-all duration-300 hover:scale-[1.02] "
                  >
                    <span className="p-2 bg-white/20 rounded-full flex items-center justify-center ">
                      <FaGraduationCap className="h-6 w-6 transition-all duration-300" />
                    </span>
                    <span className="text-[13px] font-medium cursor-pointer hover:underline transition-all duration-300">
                      {education}
                    </span>
                  </div>
                )}

                {liveIn && (
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={"Live In"}
                    className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-all duration-300 hover:scale-[1.02] "
                  >
                    <span className="p-2 bg-white/20 rounded-full flex items-center justify-center ">
                      <TbHomeFilled className="h-6 w-6 transition-all duration-300" />
                    </span>
                    <span className="text-[13px] font-medium cursor-pointer hover:underline transition-all duration-300">
                      {liveIn}
                    </span>
                  </div>
                )}

                {relationshipStatus && (
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={"Relationship"}
                    className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="p-2 bg-white/20 rounded-full flex items-center justify-center">
                      {renderRelationshipIcon(relationshipStatus)}
                    </span>
                    <span className="text-[13px] font-medium cursor-pointer hover:underline transition-all duration-300">
                      {relationshipStatus}
                    </span>
                  </div>
                )}
                {phoneNumber && (
                  <div
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={"Phone Number"}
                    className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-all duration-300 hover:scale-[1.02] "
                  >
                    <span className="p-2 bg-white/20 rounded-full flex items-center justify-center ">
                      <MdOutlinePhoneAndroid className="h-6 w-6 transition-all duration-300" />
                    </span>
                    <span className="text-[13px] font-medium cursor-pointer hover:underline transition-all duration-300">
                      {phoneNumber}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditDetail(true)}
                className="px-4 w-full py-2 font-medium text-white rounded-md shadow-md transition-all transform bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 hover:scale-[1.02] hover:shadow-md"
              >
                Edit Details
              </button>
            </div>

            {/*  */}
          </div>
        </div>
        <div className="col-span-5 sm:col-span-3 p-2">
          <div className="w-full flex flex-col gap-4">
            {/* Create Post Section */}
            <CreatePost getPosts={allUserPost} />
            {/* Posts */}
            <Posts
              user={auth?.user?._id === userId ? auth?.user : user}
              loading={postloading}
              posts={posts}
              getAllPost={allUserPost}
              page={"home"}
            />
          </div>
        </div>
      </div>
      {/* ---------Modals------ */}
      {isEditDetail && (
        <div className="fixed left-0 top-0 w-[100%] min-h-[100vh] inset-0 z-[9999999] flex items-center justify-center bg-white/70 p-4 dark:bg-slate-800/70">
          <EditDetail
            closeEditDetail={closeEditDetail}
            setIsEditDetail={setIsEditDetail}
            about={about}
            websiteURL={website}
          />
        </div>
      )}
    </div>
  );
}
