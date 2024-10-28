import React from "react";

export default function PostLoader() {
  const loaders = Array.from({ length: 10 });

  return (
    <div className="flex flex-col gap-4">
      {loaders.map((_, index) => (
        <div
          key={index}
          className="w-full py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-md flex flex-col gap-2 animate-pulse"
        >
          {/* Header: Profile and Username */}
          <div className="w-full flex items-center justify-between px-3">
            <div className="flex items-center gap-1">
              {/* Profile Image Skeleton */}
              <div className="w-[3.2rem] h-[3.2rem]">
                <div className="relative w-[3rem] h-[3rem] bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden"></div>
              </div>
              {/* User Info Skeleton */}
              <div className="flex flex-col gap-1">
                <div className="w-[8rem] h-[1rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                <div className="w-[5rem] h-[0.8rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
              </div>
            </div>
            {/* Option Menu Skeleton */}
            <div className="w-[2rem] h-[2rem] bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          </div>

          {/* Post Content Skeleton */}
          <div className="flex w-full px-3">
            <div className="w-full h-[2rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </div>

          {/* Media Skeleton */}
          <div className="relative w-full h-[22rem] bg-gray-300 dark:bg-gray-700"></div>

          {/* Comments, Likes, Views Skeleton */}
          <div className="flex items-center justify-between px-3">
            <div className="w-[3rem] h-[1rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            <div className="flex gap-4">
              <div className="w-[3rem] h-[1rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
              <div className="w-[3rem] h-[1rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex items-center justify-between gap-4 px-4">
            <div className="w-[5rem] h-[1.5rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            <div className="w-[5rem] h-[1.5rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            <div className="w-[5rem] h-[1.5rem] bg-gray-300 dark:bg-gray-600 rounded-md hidden sm:block"></div>
            <div className="w-[5rem] h-[1.5rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </div>

          {/* Divider */}
          <div className="my-1 px-2">
            <hr className="w-full h-[1px] bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Comments Skeleton */}
          <div className="flex flex-col gap-3 px-4">
            <div className="w-full h-[1.5rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            <div className="w-full h-[1.5rem] bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
