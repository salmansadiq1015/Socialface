import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { Style } from "@/app/utils/CommonStyle";
import { FaUserPlus } from "react-icons/fa6";
import { LuLoader } from "react-icons/lu";
import { useRouter } from "next/navigation";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};

export default function AllUsers({ usersData, user }) {
  const [friendRequests, setFriendRequests] = useState([]);
  const [sendload, setSendLoad] = useState(false);
  const [cancelLoad, setCancelLoad] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  // Filter Friends Request
  useEffect(() => {
    if (user?._id) {
      const currentUser = usersData.find((u) => u._id === user._id);
      setFriendRequests(currentUser?.sendFriendRequests || []);
    }
  }, [usersData, user]);

  // -------Send Friend Request------->
  const sendFriendRequest = async (receiverId) => {
    setSendLoad(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/frient/request/${receiverId}`
      );
      if (data?.success) {
        setSendLoad(false);
        toast.success("Friend request sent successfully!");
        setFriendRequests([...friendRequests, receiverId]);
        setUserId("");
      }
    } catch (error) {
      setSendLoad(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  // -------Cancel Friend Request------->
  const cancelFriendRequest = async (receiverId) => {
    setCancelLoad(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/cancel/friend/request/${receiverId}`
      );
      if (data?.success) {
        toast.success("Friend request canceled!");
        setFriendRequests(friendRequests.filter((id) => id !== receiverId));
        setCancelLoad(false);
        setUserId("");
      }
    } catch (error) {
      console.log(error);
      setCancelLoad(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div>
      {" "}
      <div className=" py-8 px-3 ">
        <Slider {...settings}>
          {usersData?.map((item, index) => (
            <div key={index} className=" px-4 mt-4">
              <div
                className={`relative h-[16rem] overflow-hidden rounded-md shadow-md border hover:scale-[1.03]  transition-all duration-200 cursor-pointer dark:bg-gray-800 hover:dark:shadow-gray-700  bg-gray-100 hover:shadow-gray-300`}
              >
                <div
                  onClick={() => router.push(`/profile/${item?._id}`)}
                  className="w-full relative h-[9rem] border-b flex items-center justify-center overflow-hidden"
                >
                  <Image
                    src={
                      item?.profilePicture
                        ? item?.profilePicture
                        : "/profile.png"
                    }
                    alt="cardImage"
                    layout="responsive"
                    width={500}
                    height={130}
                    className="object-fill w-full h-[8rem]"
                  />
                </div>
                <div
                  className="p-4"
                  onClick={() => router.push(`/profile/${item?._id}`)}
                >
                  <h3 className="text-[14px] sm:text-[15px] font-semibold text-start truncate">
                    {`${item?.firstName}  ${
                      item?.lastName ? item?.lastName : ""
                    }`}
                  </h3>
                </div>
                <div className="w-full flex items-center justify-center py-3">
                  {friendRequests.includes(item._id) ? (
                    <button
                      disabled={cancelLoad}
                      className={` flex items-center justify-center  py-[5px] px-2 rounded-md shadow-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 hover:dark:bg-gray-600 cursor-pointer text-black dark:text-white text-[13px]`}
                      onClick={() => {
                        setUserId(item._id);
                        cancelFriendRequest(item._id);
                      }}
                    >
                      {cancelLoad && userId === item._id ? (
                        <LuLoader className="h-5 w-5 text-black dark:text-white animate-spin" />
                      ) : (
                        "Cancel Request"
                      )}
                    </button>
                  ) : (
                    <button
                      disabled={sendload}
                      className={`flex items-center justify-center py-[5px] px-2 rounded-md shadow-sm bg-orange-500 hover:bg-orange-600 cursor-pointer text-white text-[14px]`}
                      onClick={() => {
                        setUserId(item._id);
                        sendFriendRequest(item._id);
                      }}
                    >
                      {sendload && userId === item._id ? (
                        <LuLoader className="h-5  w-5 text-white animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1">
                          <FaUserPlus className="h-5 w-5 text-white" />
                          Add Friend
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
