"use client";
import React, { useEffect, useState } from "react";
import UserLayout from "@/app/components/layouts/UserLayout";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/authContext";

export default function Call({ params }) {
  const { auth } = useAuth();
  const router = useRouter();
  const roomID = params.id;
  const appID = 1101658594;
  const serverSecret = "dddc24a2b524eeadd2a1b27ef050e665";
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.origin);
    }
  }, []);

  const myMeeting = async (element) => {
    try {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        auth?.user?._id,
        auth?.user?.firstName + " " + auth?.user?.lastName
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);
      zc.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Copy Link",
            url: `${url}/room/${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong!");
    }
  };
  return (
    <UserLayout>
      <div className="relative w-full h-full ">
        <span
          className="absolute top-2 z-20 left-2 ring-1 ring-gray-200 dark:ring-slate-700 rounded-full p-1 cursor-pointer bg-gray-200/50 hover:bg-gray-200/70 dark:bg-slate-700/50 hover:dark:bg-slate-700/70 transition-all duration-300 text-orange-500 hover:text-orange-600"
          onClick={() => router.back()}
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Back to Chat"
        >
          <IoArrowBackOutline className="h-4 w-4" />
        </span>
        <div className="w-full h-full py-4 px-4">
          <div ref={myMeeting} className=" h-full" />
        </div>
      </div>
    </UserLayout>
  );
}
