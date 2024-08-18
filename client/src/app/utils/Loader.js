import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loader() {
  return (
    <div className="w-full min-h-[70vh]">
      <div className="w-full h-full">
        <SkeletonTheme baseColor="#ccc" highlightColor="#777">
          <p>
            <Skeleton
              count={9}
              height={55}
              width="100%"
              className="animate-pulse"
            />
          </p>
        </SkeletonTheme>
      </div>
    </div>
  );
}
