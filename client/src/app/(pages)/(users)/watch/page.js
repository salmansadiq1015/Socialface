"use client";
import UserLayout from "@/app/components/layouts/UserLayout";
import { useAuth } from "@/app/context/authContext";
import React, { useEffect } from "react";

export default function Watch() {
  const { isActive, setIsActive } = useAuth();

  useEffect(() => {
    setIsActive(2);

    // eslint-disable-next-line
  }, [isActive]);
  return (
    <UserLayout title="SocialFace - Home">
      <div className="w-full h-full min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
        <div class="flex flex-1">
          {/* <!-- Left Column --> */}
          <div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2  hidden lg:block">
            <div class="bg-gray-200 p-4 h-32">Left Content Watch</div>
          </div>

          {/* <!-- Center Column --> */}
          <div class="w-full min-h-screen md:w-7/10 lg:w-7/10 xl:w-7/10 md:mx-auto">
            <div class="bg-gray-300 p-4 h-32">Center Content watch</div>
          </div>

          {/* <!-- Right Column --> */}
          <div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 hidden md:block">
            <div class="bg-gray-400 p-4 h-32">Right Content</div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
