"use client";

import { useEffect, useState } from "react";
import UserLayout from "./components/layouts/UserLayout";
import { useAuth } from "./context/authContext";
import Stories from "./components/user/Home/center/Stories";
import CreatePost from "./components/user/Home/center/CreatePost";
import Posts from "./components/user/Home/center/Posts";
import toast from "react-hot-toast";
import axios from "axios";

export default function Home() {
  const { auth, isActive, setIsActive } = useAuth();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setIsActive(1);

    // eslint-disable-next-line
  }, [isActive]);

  // Get ALl Posts
  const getAllPost = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/get/posts`
      );
      setPosts(data?.posts);
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
        <div class="flex flex-1">
          {/* <!-- Left Column --> */}
          <div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2  hidden lg:block">
            {/* <div class="bg-gray-200 p-4 h-32">Left Content</div> */}
          </div>

          {/* <!-- Center Column --> */}
          <div class="w-full min-h-screen md:w-6/10 lg:w-6/10 xl:w-6/10 md:mx-auto ">
            <div class="w-full flex flex-col gap-4 h-screen py-4 px-1 border-l border-gray-400 border-r overflow-y-scroll shidden">
              {/* Stories Section */}
              <div className="w-full overscroll-x-auto ">
                <Stories user={auth.user} />
              </div>
              {/* Create Post Section */}
              <CreatePost user={auth.user} getAllPost={getAllPost} />
              {/* Post Section */}
              <Posts
                user={auth.user}
                loading={loading}
                posts={posts}
                getAllPost={getAllPost}
              />
            </div>
          </div>

          {/* <!-- Right Column --> */}
          <div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 hidden md:block">
            {/* <div class="bg-gray-400 p-4 h-32">Right Content</div> */}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
