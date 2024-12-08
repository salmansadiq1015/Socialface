import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useTheme } from "next-themes";

export default function EditDetail({
  closeEditDetail,
  setIsEditDetail,
  about,
  websiteURL,
}) {
  const { theme } = useTheme();
  const [website, setWebsite] = useState("");
  const [work, setWork] = useState("");
  const [education, setEducation] = useState("");
  const [liveIn, setLiveIn] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isloading, setIsloading] = useState(false);
  console.log("about:", about);

  useEffect(() => {
    setWebsite(websiteURL);
    setWork(about?.work);
    setEducation(about?.education);
    setLiveIn(about?.liveIn);
    setRelationshipStatus(about?.relationshipStatus);
    setPhoneNumber(about?.phoneNumber);
  }, [about, websiteURL]);

  //   Update Personal Detail
  const updatePersonalDetail = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/`
      );

      if (data) {
        setIsEditDetail(false);
        setWebsite("");
        setWork("");
        setEducation("");
        setLiveIn("");
        setRelationshipStatus("");
        setPhoneNumber("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div
      ref={closeEditDetail}
      className="w-[40rem]  rounded-md shadow-md border bg-white dark:bg-slate-900 dark:border-gray-700"
    >
      <div className="flex items-center justify-between py-2 px-4 border-b border-gray-100 dark:border-slate-700 shadow-sm">
        <h2 className="text-xl font-semibold">Edit Details</h2>
        <span
          onClick={() => setIsEditDetail(false)}
          className="p-[4px] rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-800 transition-all duration-300 transform hover:rotate-180 hover:scale-110"
        >
          <IoCloseCircleOutline className="h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-300 transition-all duration-300" />
        </span>
      </div>
      {/*  */}
      <div className="p-4 w-full">
        <form
          onSubmit={updatePersonalDetail}
          className=" flex flex-col gap-4 w-full h-[27rem] overflow-y-auto shidden "
        >
          <div
            className={` mt-2 ${theme === "dark" ? "dinputBox" : "inputBox"}`}
          >
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              autoFocus
              className={`${Style.input} w-full  focus:border-orange-500 `}
            />
            <span>Website URL</span>
          </div>
          <div
            className={` mt-2 ${theme === "dark" ? "dinputBox" : "inputBox"}`}
          >
            <input
              type="text"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              className={`${Style.input} w-full  focus:border-orange-500 `}
            />
            <span>Work</span>
          </div>
          <div
            className={` mt-2 ${theme === "dark" ? "dinputBox" : "inputBox"}`}
          >
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className={`${Style.input} w-full   focus:border-orange-500`}
            />
            <span>Education</span>
          </div>
          <div
            className={` mt-2 ${theme === "dark" ? "dinputBox" : "inputBox"}`}
          >
            <input
              type="text"
              value={liveIn}
              onChange={(e) => liveIn(e.target.value)}
              className={`${Style.input} w-full  focus:border-orange-500 `}
            />
            <span>Live In</span>
          </div>
          <div
            className={` mt-2 ${theme === "dark" ? "dinputBox" : "inputBox"}`}
          >
            <select
              value={relationshipStatus}
              onChange={(e) => setRelationshipStatus(e.target.value)}
              className="w-full h-[2.4rem] rounded-md border-2 border-gray-950 dark:border-gray-50 px-2 outline-none bg-gray-50 dark:bg-slate-900 dark:text-white text-gray-900 hover:bg-gray-100  focus:border-orange-500"
            >
              <option
                value=""
                className="text-[14px] text-gray-600 dark:text-gray-300"
              >
                Select Relation Status
              </option>
              <option
                value="Single"
                className="text-[14px] text-gray-800 dark:text-gray-100"
              >
                Single
              </option>
              <option
                value="In a relationship"
                className="text-[14px] text-gray-800 dark:text-gray-100"
              >
                In a relationship
              </option>
              <option
                value="Married"
                className="text-[14px] text-gray-800 dark:text-gray-100"
              >
                Married
              </option>
              <option
                value="Divorced"
                className="text-[14px] text-gray-800 dark:text-gray-100"
              >
                Divorced
              </option>
              <option
                value="Complicated"
                className="text-[14px] text-gray-800 dark:text-gray-100"
              >
                Complicated
              </option>
              <option
                value="Widowed"
                className="text-[14px] text-gray-800 dark:text-gray-100"
              >
                Widowed
              </option>
            </select>
          </div>
          <div
            className={` mt-2 ${theme === "dark" ? "dinputBox" : "inputBox"}`}
          >
            <input
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${Style.input} w-full  focus:border-orange-500`}
            />
            <span>Phone Number</span>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-4 w-[6rem] py-2 text-[13px]   font-normal text-white rounded-md shadow-md transition-all transform bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 hover:scale-[1.02] hover:shadow-md"
            >
              {isloading ? (
                <CgSpinnerTwo className="h-4 w-4 text-white" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
