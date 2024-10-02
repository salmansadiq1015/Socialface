"use client";
import UserLayout from "@/app/components/layouts/UserLayout";
import Posts from "@/app/components/user/Home/center/Posts";
import { useAuth } from "@/app/context/authContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Watch() {
  const { isActive, setIsActive, auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setIsActive(2);

    // eslint-disable-next-line
  }, [isActive]);

  // Get ALl Posts
  const getAllPost = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/get/posts`
      );
      const filterData = data.posts.filter(
        (item) => item.mediaType === "Video"
      );
      setPosts(filterData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <UserLayout title="SocialFace - Home">
      <div className="w-full h-full min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
        <div className="grid grid-cols-10">
          <div className=" hidden sm:flex sm:col-span-3 bg-sky-400 ">1</div>
          <div className="col-span-10 sm:col-span-7 w-full h-screen ">
            <div class="w-full flex flex-col gap-4 h-screen pb-[6rem] sm:pb-[4rem] py-4 px-1 border-l border-gray-200 dark:border-gray-600 border-r overflow-y-scroll shidden">
              <Posts
                user={auth.user}
                loading={loading}
                posts={posts}
                getAllPost={getAllPost}
                page={"watch"}
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
