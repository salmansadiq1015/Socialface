import { Style } from "@/app/utils/CommonStyle";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { TbLoader2 } from "react-icons/tb";
import { ImSpinner9 } from "react-icons/im";
import { uploadImage } from "@/app/utils/CommonFunction";
import { useAuth } from "@/app/context/authContext";

export default function CreateGroupModel({
  allContacts,
  setIsGroup,
  allChats,
  groupId,
  setGroupId,
  closeGroupModel,
}) {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [chatName, setChatName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Single Group
  const fetchGroup = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chats/fetch/group/chat/${groupId}`
      );
      console.log("data:", data.result);
      setAvatar(data.result[0].avatar);
      setChatName(data.result[0].chatName);
      setUsers(data.result[0].users);
    } catch (error) {}
  };

  useEffect(() => {
    fetchGroup();

    // eslint-disable-next-line
  }, [groupId]);

  //   Add Users
  const handleAddUser = (user) => {
    if (!Array.isArray(users)) {
      setUsers([user]);
      return;
    }

    if (users.some((existingUser) => existingUser._id === user._id)) {
      return toast.error("User already exists!");
    }
    setUsers([...users, user]);
  };

  //   Remove user

  const handleRemoveUser = (id) => {
    const newUsers = users.filter((user) => user._id !== id);

    setUsers(newUsers);
  };

  //   Handle Create Group
  const handleGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (groupId) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chats/fetch/group/chat/${groupId}`,
          { chatName, avatar, users: JSON.stringify(users) }
        );
        if (data) {
          allChats();
          setIsGroup(false);
          setGroupId("");
          setUsers([]);
          setChatName("");
          setAvatar("");
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/chats/create/group/chat`,
          { chatName, avatar, users: JSON.stringify(users) }
        );
        if (data) {
          allChats();
          setIsGroup(false);
          setGroupId("");
          setUsers([]);
          setChatName("");
          setAvatar("");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={closeGroupModel}
      className="w-[30rem] py-4 px-4 flex flex-col gap-6 rounded-md bg-gray-50 border dark:border-gray-700 dark:bg-slate-900"
    >
      <h3 className="text-lg font-medium">
        {groupId ? "Edit a Group" : "Create a Group"}
      </h3>
      <form onSubmit={handleGroup} className=" flex flex-col gap-4">
        {/* Avatar */}
        <div className=" relative flex items-center gap-2 w-full">
          <label htmlFor="avatar" disabled={load}>
            <div className="relative w-[3.6rem] h-[3.6rem] cursor-pointer p-1 rounded-full border-2 overflow-hidden  border-orange-500">
              <Image
                src={!avatar ? "/profile.png" : avatar}
                alt="avatar"
                layout="fill"
                className="h-full w-full "
              />
            </div>
            <input
              type="file"
              onChange={(e) =>
                uploadImage(e.target.files[0], setAvatar, setLoad)
              }
              className="hidden"
              id="avatar"
            />
          </label>
          {load && (
            <span>
              <ImSpinner9 className="h-5 w-5 text-orange-500 animate-spin" />
            </span>
          )}
        </div>
        <input
          type="text"
          placeholder="Group Name"
          required
          className={`${Style.input} w-full`}
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
        />
        {users?.length > 0 && (
          <div className="w-full flex items-center gap-4 flex-wrap border py-2 px-2 rounded-md border-gray-400">
            {users &&
              users.map((user) => (
                <div
                  key={user?._id}
                  className="flex items-center gap-3 bg py-1 px-2 rounded-md text-white bg-orange-600"
                >
                  <span className="text-white text-[15px]">
                    {user?.firstName + " " + user?.lastName}
                  </span>
                  <span
                    className="cursor-pointer bg-red-500/50 p-[2px] rounded-full hover:bg-red-500"
                    onClick={() => handleRemoveUser(user?._id)}
                  >
                    <IoClose className="h-4 w-4 " />
                  </span>
                </div>
              ))}
          </div>
        )}
        <select
          value=""
          className={`${Style.input}`}
          onChange={(e) => handleAddUser(JSON.parse(e.target.value))}
        >
          <option>Select User</option>
          {allContacts &&
            allContacts
              ?.filter((contact) => contact?._id !== auth?.user?._id)
              .map((user) => (
                <option
                  key={user?._id}
                  value={JSON.stringify({
                    _id: user._id,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                  })}
                  className=" flex items-center gap-1"
                >
                  {user?.firstName + " " + user?.lastName}
                </option>
              ))}
        </select>

        <div className="flex items-center justify-end mt-[2.5rem]">
          <button
            disabled={loading}
            className={`${Style.button2} text-[15px] `}
            type="submit"
            style={{ padding: ".3rem 1.5rem" }}
          >
            {loading ? (
              <TbLoader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <span className="text-[15px]">
                {groupId ? "Save" : "Create Group"}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
