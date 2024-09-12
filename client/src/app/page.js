"use client";

import { useEffect, useState } from "react";
import UserLayout from "./components/layouts/UserLayout";
import { useAuth } from "./context/authContext";
import Stories from "./components/user/Home/center/Stories";
import CreatePost from "./components/user/Home/center/CreatePost";
import Posts from "./components/user/Home/center/Posts";
import toast from "react-hot-toast";
import axios from "axios";
import Sponsored from "./components/user/Home/right/Sponsored";
import ContactsList from "./components/user/Home/right/ContactsList";
import FriendList from "./components/user/Home/right/FriendList";
import HomeLeftSide from "./components/user/Home/Left/HomeLeftSide";

export default function Home() {
  const { auth, isActive, setIsActive } = useAuth();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [friendsList, setFrientsList] = useState([]);
  const [loadUsers, setLoadUsers] = useState(false);
  const [loadFriends, setLoadFriends] = useState(false);

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

  // Get ALl Users/Contacts
  const getAllUsers = async () => {
    setLoadUsers(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/all/contactlist`
      );
      setContactList(data?.users);
      setLoadUsers(false);
    } catch (error) {
      setLoadUsers(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <UserLayout title="SocialFace - Home">
      <div className="w-full h-full min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
        <div class="flex flex-1">
          {/* <!-- Left Column --> */}
          <div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2  hidden lg:block">
            <HomeLeftSide />
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
          <div class=" w-full md:w-1/2 lg:w-1/2 xl:w-1/2 hidden md:block px-2 py-2">
            <div className=" flex flex-col gap-4 w-full  h-screen overflow-y-auto">
              <Sponsored />
              {/* <hr className="w-full h-[1px] bg-gray-300 dark:bg-gray-800 my-1" /> */}
              <FriendList
                friendsList={contactList}
                loadFriends={loadUsers}
                getAllContactUsers={getAllUsers}
              />
              {/* <hr className="w-full bg-gray-200 dark:bg-gray-800 my-1" /> */}
              <ContactsList
                loadUsers={loadUsers}
                contactList={contactList}
                getAllContactUsers={getAllUsers}
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
