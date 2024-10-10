"use client";
import React, { useEffect, useRef } from "react";
import UserLayout from "@/app/components/layouts/UserLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/authContext";

export default function Call({ params }) {
  const { auth } = useAuth();
  const searchParams = useSearchParams();
  const callType = searchParams.get("callType") || "video";
  const router = useRouter();
  const roomID = params.id;
  const containerRef = useRef(null);
  const appID = 1101658594;
  const serverSecret = "dddc24a2b524eeadd2a1b27ef050e665";
  const zegoInstanceRef = useRef(null);

  useEffect(() => {
    const initializeZego = async () => {
      try {
        // Check if there's an existing instance
        if (zegoInstanceRef.current) {
          if (typeof zegoInstanceRef.current.leave === "function") {
            if (zegoInstanceRef.current.hasJoinedRoom) {
              console.warn("Leaving existing room before joining a new one.");
              await zegoInstanceRef.current.leave(); // Only leave if already joined
            } else {
              console.warn("Zego instance is not valid for leaving.");
            }
          } else {
            console.error(
              "Current Zego instance does not have a leave method:",
              zegoInstanceRef.current
            );
          }
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          auth?.user?._id,
          `${auth?.user?.firstName} ${auth?.user?.lastName}`
        );

        if (!kitToken) {
          throw new Error("Failed to generate token");
        }

        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zc; // Store the instance
        console.log("Zego instance created:", zegoInstanceRef.current);

        // Define media options based on call type
        const mediaOptions = {
          audio: true,
          video: callType === "video",
        };

        // Join the room
        zc.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: "Copy Link",
              url: `${window.location.origin}/room/${roomID}?callType=${callType}`,
            },
          ],
          scenario: {
            mode: (() => {
              switch (callType) {
                case "video":
                  return ZegoUIKitPrebuilt.OneONoneCall;
                case "audio":
                  return ZegoUIKitPrebuilt.VoiceCall;
                case "group":
                  return ZegoUIKitPrebuilt.GroupCall;
                default:
                  throw new Error("Invalid call type");
              }
            })(),
          },
          showScreenSharingButton: callType === "video" || callType === "group",
          video: mediaOptions.video,
          audio: mediaOptions.audio,
        });
      } catch (error) {
        console.error("Zego Error:", error);
        toast.error(error.message || "Something went wrong!");
      }
    };

    initializeZego();

    return () => {
      // Cleanup when component unmounts
      if (zegoInstanceRef.current) {
        console.log(
          "Current Zego instance on unmount:",
          zegoInstanceRef.current
        );
        if (
          typeof zegoInstanceRef.current.leave === "function" &&
          zegoInstanceRef.current.hasJoinedRoom
        ) {
          console.log("Leaving the room on unmount");
          zegoInstanceRef.current.leave();
        }
      }
    };
  }, [roomID, callType, auth, appID, serverSecret]);

  return (
    <UserLayout>
      <div className="relative w-full h-full">
        <span
          className="absolute top-2 z-20 left-2 ring-1 ring-gray-200 dark:ring-slate-700 rounded-full p-1 cursor-pointer bg-gray-200/50 hover:bg-gray-200/70 dark:bg-slate-700/50 hover:dark:bg-slate-700/70 transition-all duration-300 text-orange-500 hover:text-orange-600"
          onClick={() => router.back()}
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Back to Chat"
        >
          <IoArrowBackOutline className="h-4 w-4" />
        </span>
        <div className="w-full h-full py-4 px-4">
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>
    </UserLayout>
  );
}
