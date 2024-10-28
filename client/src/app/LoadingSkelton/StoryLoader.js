import React from "react";

export default function StoryLoader() {
  const skeletonStories = Array.from({ length: 6 });

  return (
    <div className="flex items-center gap-4">
      {skeletonStories.map((_, index) => (
        <div
          key={index}
          className="relative bg-gray-100 dark:bg-gray-800 w-40 h-60 flex-shrink-0 shadow-md transition-all duration-200 border overflow-hidden rounded-lg cursor-pointer animate-pulse"
        >
          {/* Profile Image Skeleton */}
          <div className="absolute top-2 left-2 w-[2.5rem] h-[2.5rem] rounded-full bg-gray-300 dark:bg-gray-700 border-2 border-orange-600 z-20"></div>

          {/* Media Skeleton (Image/Video) */}
          <div className="w-full h-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

          {/* User Name Skeleton */}
          <div className="absolute bottom-0 left-0 p-2 w-full bg-gradient-to-t from-black to-transparent rounded-b-lg">
            <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
