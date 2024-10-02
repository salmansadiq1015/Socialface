"use client";
import UserLayout from "@/app/components/layouts/UserLayout";
import { useAuth } from "@/app/context/authContext";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiCommentDetail, BiLoaderCircle } from "react-icons/bi";
import { BsEmojiSmile, BsThreeDots, BsWhatsapp } from "react-icons/bs";
import { FaGlobeEurope } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";
import { IoClose, IoSend } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { PiShareFat } from "react-icons/pi";
import { WhatsappShareButton } from "react-share";
import { format } from "timeago.js";
import { format as dateFormat } from "date-fns";
import ShareData from "@/app/utils/ShareData";
import { IoIosPlayCircle } from "react-icons/io";
import Swal from "sweetalert2";

export default function PostDetail({ params }) {
  const { auth } = useAuth();
  const [postDetail, setPostDetail] = useState([]);
  const [postId, setPostId] = useState("");
  const [updateShow, setUpdateShow] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [postLiked, setPostLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [commentData, setCommentData] = useState([]);
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [commentReply, setCommentReply] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [commentLikes, setCommentLikes] = useState([]);
  const [commentLikeCounts, setCommentLikeCounts] = useState({});
  const [commentId, setCommentId] = useState("");
  const [showReplyPicker, setShowReplyPicker] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const router = useRouter();
  const fetchCalled = useRef(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.origin);
    }
  }, []);
  //   Get Single Post
  const getPostDetail = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/single/post/${params.id}`
      );
      setPostDetail(data.post);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!fetchCalled.current) {
      getPostDetail();
      fetchCalled.current = true;
    }

    // eslint-disable-next-line
  }, [params.id]);

  //--------- Add Emojis-------
  const onEmojiClick = (event) => {
    setComment((prevComment) => prevComment + event.emoji);
  };
  // Add Emoji on Reply
  const onEmojiClickReply = (event) => {
    setCommentReply((prevComment) => prevComment + event.emoji);
  };

  //   -------------Like & Unlike Post----------

  useEffect(() => {
    setPostLiked(postDetail?.likes?.includes(auth?.user?._id));
    setLikeCount(postDetail?.likes?.length);
  }, [postDetail.likes, auth]);

  const likePost = async (id) => {
    try {
      setPostLiked(true);
      setLikeCount(likeCount + 1);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/like/post/${id}`,
        {},
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (!data.success) {
        throw new Error("Failed to like post");
      }

      toast.success("Post liked!");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);

      // Revert optimistic update if request fails
      setPostLiked(false);
      setLikeCount(likeCount - 1);
    }
  };

  const unlikePost = async (id) => {
    try {
      // Optimistically update the UI
      setPostLiked(false);
      setLikeCount(likeCount - 1);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/unlike/post/${id}`,
        {},
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (!data.success) {
        throw new Error("Failed to unlike post");
      }

      toast.success("Post unliked!");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);

      // Revert optimistic update if request fails
      setPostLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  // ---------Get Single Post Comment----->

  //   Get Single Post
  const getSingleJobComment = async () => {
    if (!postId) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/post/comments/${postId}`
      );
      if (data) {
        setCommentData(data.comments.comments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleJobComment();
    // eslint-disable-next-line
  }, [postId]);

  //   Add Comment
  const handleComment = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!postId) {
      setIsLoading(false);
      toast.error("Post Id is required!");
      return;
    }
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/add/comment`,
        {
          comment: comment,
          postId: postId,
        }
      );
      if (data) {
        setComment("");
        getSingleJobComment();
        setIsLoading(false);
        toast.success("Comment Posted!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  //   Add Comment Reply
  const handleCommentReply = async (e) => {
    e.preventDefault();
    setReplyLoading(true);
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/add/comment/reply`,
        { commentReply: commentReply, postId: postId, commentId: commentId }
      );
      if (data) {
        setReplyLoading(false);
        setCommentReply("");
        getSingleJobComment();
        toast.success("Reply added successfully!");
      }
    } catch (error) {
      console.log(error);
      setReplyLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // -----Like Counts----->
  useEffect(() => {
    setCommentLikes(
      commentData.reduce((acc, comment) => {
        acc[comment._id] = comment.likes.includes(auth.user._id);
        return acc;
      }, {})
    );
    setCommentLikeCounts(
      commentData.reduce((acc, comment) => {
        acc[comment._id] = comment.likes.length;
        return acc;
      }, {})
    );
  }, [commentData, auth.user]);

  // -------Like Comment------>
  const likeComment = async (commentId) => {
    try {
      setCommentLikes((prevLike) => ({
        ...prevLike,
        [commentId]: true,
      }));

      setCommentLikeCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: prevCounts[commentId] + 1,
      }));

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/like/comment`,
        { postId: postId, commentId: commentId }
      );
      if (data) {
        toast.success("Liked!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setCommentLikes((prevLikes) => ({
        ...prevLikes,
        [commentId]: false,
      }));
      setCommentLikeCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: prevCounts[commentId] - 1,
      }));
    }
  };

  // --------Unlike Comment--------->
  const unlikeComment = async (commentId) => {
    try {
      setCommentLikes((prevLike) => ({
        ...prevLike,
        [commentId]: false,
      }));

      setCommentLikeCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: prevCounts[commentId] - 1,
      }));

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/unlike/comment`,
        { postId: postId, commentId: commentId }
      );
      if (data) {
        toast.success("Comment unliked!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      setCommentLikes((prevLikes) => ({
        ...prevLikes,
        [commentId]: true,
      }));
      setCommentLikeCounts((prevCounts) => ({
        ...prevCounts,
        [commentId]: prevCounts[commentId] + 1,
      }));
    }
  };

  // ---------Post Views Format------->
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000)?.toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000)?.toFixed(1) + "K";
    } else {
      return views?.toString();
    }
  };

  // -----------Delete Post -------->
  const handleDeleteConfirmation = (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this post!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePost(postId);
        Swal.fire("Deleted!", "Your job has been deleted.", "success");
      }
    });
  };
  const deletePost = async (id) => {
    setDeleteLoading(true);
    try {
      const data = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/post/delete/post/${id}`
      );
      if (data) {
        toast.success("Post deleted successfully!");
        setDeleteLoading(false);
        router.push("/");
      }
    } catch (error) {
      setDeleteLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <UserLayout title="SocialFace - Home">
      <div className="w-full min-h-screen dark:text-white text-black">
        <div className="grid grid-cols-1 sm:grid-cols-10 gap-2  ">
          {/* 1 */}
          <div className="relative col-span-6 md:col-span-7 py-4 px-2 sm:px-4 w-full h-full border-r dark:border-gray-700  ">
            <span
              onClick={() => router.back()}
              className="absolute top-1 left-1 cursor-pointer p-1 rounded-full bg-gray-200/50 dark:bg-gray-800/30 hover:bg-gray-300/50 hover:dark:bg-gray-700/50 z-[10]"
            >
              <IoClose className="h-6 w-6 " />
            </span>
            <div className="h-[17rem] sm:h-[80vh] p-1 sm:p-3 rounded-lg bg-gray-100/60 dark:bg-gray-800/60 flex items-center justify-center w-full  border dark:border-gray-600 shadow-md">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer  ">
                {postDetail?.mediaType === "Image" ? (
                  <Image
                    src={postDetail?.mediaUrl}
                    layout="fill"
                    alt="Story"
                    className=""
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={postDetail?.mediaUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      preload="none"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* -------2----------- */}
          <div className="col-span-4 md:col-span-3 py-4 px-0 sm:pr-1 h-screen overflow-auto shidden ">
            <div className="flex flex-col gap-2">
              <div className="w-full flex items-center justify-between px-3">
                <div className="flex items-center gap-1">
                  <div className="w-[2.9rem] h-[2.9rem]">
                    <div className="relative w-[2.7rem] h-[2.7rem] bg-white dark:bg-gray-800 rounded-full border-2 border-orange-600 overflow-hidden z-20">
                      <Image
                        src={postDetail?.profileImage}
                        alt="Profile"
                        layout="fill"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <h4 className="font-medium text-[16px]">
                        {postDetail?.userName} •
                      </h4>
                      <button className="text-[16px] font-medium text-orange-500 hover:text-orange-600">
                        Follow
                      </button>
                    </div>
                    <span className="text-[14px] text-gray-500 flex items-center gap-[3px] dark:text-gray-300 font-light">
                      {format(postDetail?.createdAt)} . <FaGlobeEurope />
                    </span>
                  </div>
                </div>
                <div className="relative">
                  {postDetail?.userId === auth?.user?._id && (
                    <div
                      onClick={() => {
                        setPostId(postDetail._id), setUpdateShow(!updateShow);
                      }}
                      className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-black/20 dark:hover:bg-black/60"
                    >
                      <BsThreeDots className="text-gray-700 dark:text-gray-100 cursor-pointer h-5 w-5" />
                    </div>
                  )}
                  {updateShow && (
                    <div className="absolute top-8 right-3 w-[14rem] z-[20] py-3 px-2 rounded bg-white border dark:border-gray-700 shadow-md dark:bg-slate-700 ">
                      <ul className="flex flex-col gap-3">
                        <li className="w-full bg-gray-50 border dark:border-gray-600 hover:bg-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600 py-2 px-2 rounded-md hover:shadow-md flex items-center gap-1 cursor-pointer">
                          <MdEdit className="text-gray-800 dark:text-gray-200 h-5 w-5 " />{" "}
                          <span className="text-[14px] font-medium ">
                            Update Post
                          </span>
                        </li>
                        <li
                          className={`w-full bg-gray-50 hover:bg-gray-200 border dark:border-gray-600 dark:bg-gray-700 hover:dark:bg-gray-600 py-2 px-2 rounded-md hover:shadow-md flex items-center gap-1 cursor-pointer ${
                            deleteLoading && "cursor-not-allowed"
                          } `}
                          onClick={() =>
                            handleDeleteConfirmation(postDetail?._id)
                          }
                        >
                          {deleteLoading ? (
                            <span className="w-full flex items-center justify-center">
                              <LoaderIcon className="h-6 w-6 animate-spin" />
                            </span>
                          ) : (
                            <>
                              <MdDelete className="text-red-500 h-5 w-5 " />{" "}
                              <span className="text-[14px] font-medium">
                                Delete Post
                              </span>
                            </>
                          )}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {/* content */}
              <div className="flex w-full px-3">
                <p className="text-[15px] font-normal">
                  {showMore
                    ? postDetail?.content
                    : postDetail?.content?.slice(0, 200)}
                  {postDetail?.content?.length > 200 && (
                    <span
                      className="font-medium cursor-pointer ml-2 text-orange-500 hover:border-b-[.1rem] border-orange-600"
                      onClick={() => {
                        setPostId(postDetail._id), setShowMore(!showMore);
                      }}
                    >
                      {showMore ? "Show less" : "Show more"}
                    </span>
                  )}
                </p>
              </div>
              <div className="my-1 px-2">
                <hr className="w-full h-[1px] bg-gray-200 dark:bg-gray-700" />
              </div>
              {/* Like & Comment Counts */}
              <div className="flex items-center justify-between px-3">
                <span className="flex items-center gap-[4px] text-[15px]">
                  <span className="p-1 shadow-md rounded-full bg-orange-600 ">
                    <AiFillLike className="text-white h-4 w-4" />{" "}
                  </span>
                  {likeCount}
                </span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-[4px] text-[15px]">
                    <span className="p-1 shadow-md rounded-full bg-gray-400 dark:bg-gray-500 ">
                      <FaComment className="text-white h-4 w-4 " />{" "}
                    </span>
                    {postDetail?.comments?.length || 0}
                  </span>

                  <span
                    className="flex items-center gap-[4px] text-[15px]"
                    title="Views"
                  >
                    <span className="p-1 shadow-md rounded-full bg-gray-400 dark:bg-gray-500 ">
                      <IoIosPlayCircle className="text-orange-500 h-4 w-4 " />{" "}
                    </span>
                    <span className="text-[14px]">
                      {formatViews(postDetail?.views)}
                    </span>
                  </span>
                </div>
              </div>
              <div className="my-1 px-2">
                <hr className="w-full h-[1px] bg-gray-200 dark:bg-gray-700" />
              </div>
              {/* --------Buttons---- */}
              <div className="flex items-center justify-between gap-4 px-4">
                {/* like */}
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() =>
                    postLiked
                      ? unlikePost(postDetail._id)
                      : likePost(postDetail._id)
                  }
                >
                  {postLiked ? (
                    <AiFillLike className="h-5 w-5 text-orange-600" />
                  ) : (
                    <AiOutlineLike className="h-5 w-5 text-gray-900 dark:text-white" />
                  )}
                  <span
                    className={`text-[15px] font-medium ${
                      postLiked ? "text-orange-600" : ""
                    }`}
                  >
                    Like
                  </span>
                </div>
                {/* comment */}
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    setPostId(postDetail?._id);
                    setShowComment(!showComment);
                    setShowReply(false);
                  }}
                >
                  <BiCommentDetail className="h-5 w-5 text-gray-800 dark:text-gray-50 " />

                  <span className={`text-[15px] font-medium`}>Comments</span>
                </div>
                {/* WhatsApp */}
                <WhatsappShareButton
                  url={`${currentUrl}/postDetail/${postDetail?._id}`}
                  title={postDetail?.content}
                >
                  <div className="hidden sm:flex items-center gap-1 cursor-pointer">
                    <BsWhatsapp className="h-5 w-5 text-gray-800 dark:text-gray-50 " />

                    <span className={`text-[15px] font-medium `}>Send</span>
                  </div>
                </WhatsappShareButton>
                {/* ----------Share----------- */}
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    setPostId(postDetail?._id);
                    setPostTitle(postDetail?.content);
                    setShowShare(true);
                  }}
                >
                  <PiShareFat className="h-5 w-5 text-gray-800 dark:text-gray-50 " />

                  <span className={`text-[15px] font-medium `}>Share</span>
                </div>
              </div>
              {/*  */}
              <div className="my-1 px-2">
                <hr className="w-full h-[1px] bg-gray-300 dark:bg-gray-700" />
              </div>

              {/*----------- Comments ----------*/}

              {showComment && (
                <div className="flex flex-col gap-3">
                  <div className="w-full max-h-[15rem] flex flex-col gap-3 overflow-auto px-4">
                    {/* ---------All Comments---- */}
                    {commentData &&
                      commentData?.map((comment, i) => (
                        <div
                          key={comment._id}
                          className="flex flex-col gap-1 w-full py-1 px-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                        >
                          <div className="flex items-start gap-1 w-full">
                            <div className="w-[2.4rem] h-[2.4rem]">
                              <div className="relative w-[2.2rem] h-[2.2rem] bg-white dark:bg-gray-800 rounded-full border-2 border-orange-600 overflow-hidden z-20">
                                <Image
                                  src={
                                    comment?.user?.profilePicture
                                      ? comment?.user?.profilePicture
                                      : "/profile.png"
                                  }
                                  alt="Profile"
                                  layout="fill"
                                  className="rounded-lg"
                                />
                              </div>
                            </div>
                            {/*  */}
                            <div className="flex flex-col gap-[2px] w-full ">
                              <div className="flex items-center justify-between gap-4 w-full">
                                <h3 className="text-black text-[16px] dark:text-white font-medium">
                                  {comment?.user?.name}
                                </h3>
                                {/* Post Date */}
                                <span className="text-[11px] font-light text-gray-500 dark:text-gray-300">
                                  {dateFormat(
                                    new Date(comment?.createdAt),
                                    "MMM dd 'at' p"
                                  )}
                                </span>
                              </div>
                              <p className="text-gray-600 text-[13px] font-light dark:text-gray-200">
                                {comment?.comment}
                              </p>
                            </div>
                          </div>
                          <hr className="w-full h-[1px] dark:bg-gray-500 bg-gray-300 mt-1" />
                          <div className="flex items-center justify-between">
                            <span
                              className="flex items-center cursor-pointer"
                              onClick={() =>
                                commentLikes[comment?._id]
                                  ? unlikeComment(comment?._id)
                                  : likeComment(comment?._id)
                              }
                            >
                              {commentLikes[comment._id] ? (
                                <AiFillLike className="h-5 w-5 text-orange-600" />
                              ) : (
                                <AiOutlineLike className="h-5 w-5 text-gray-900 dark:text-white" />
                              )}
                              <span className="text-[13px] mt-1">
                                ({commentLikeCounts[comment?._id] || 0})
                              </span>
                            </span>
                            <span
                              onClick={() => {
                                setCommentId(comment?._id);
                                setShowReply(!showReply);
                              }}
                              className="text-[14px] flex items-center font-medium text-orange-500 hover:text-orange-600 cursor-pointer"
                            >
                              Reply{" "}
                              {comment?.commentReplies.length > 0 && (
                                <span className="text-[12px]">
                                  ({comment?.commentReplies.length})
                                </span>
                              )}
                            </span>
                          </div>
                          {showReply && (
                            <hr className="w-full h-[1px] dark:bg-gray-500 bg-gray-300 mt-1" />
                          )}
                          {showReply && comment?._id === commentId && (
                            <div className="py-2 px-4 w-full">
                              <form
                                onSubmit={handleCommentReply}
                                className="flex flex-col gap-[2px] w-full rounded-lg border bg-gray-100  dark:bg-gray-700"
                              >
                                <textarea
                                  value={commentReply}
                                  onChange={(e) =>
                                    setCommentReply(e.target.value)
                                  }
                                  onClick={() => setShowReplyPicker(false)}
                                  placeholder={`Reply as ${
                                    auth?.user?.firstName +
                                    " " +
                                    auth?.user?.lastName
                                  }`}
                                  className="w-full h-[2rem] px-2 py-1 rounded-md border-none resize-none outline-none bg-transparent"
                                ></textarea>
                                <div className="flex items-center justify-between px-4 py-1  ">
                                  <div className="relative " title="Add Emoji">
                                    <span
                                      onClick={() =>
                                        setShowReplyPicker(!showReplyPicker)
                                      }
                                    >
                                      <BsEmojiSmile className="text-yellow-500 hover:text-yellow-600 z-20 h-4 w-4 cursor-pointer" />
                                    </span>
                                    {showReplyPicker && (
                                      <span className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                                        <EmojiPicker
                                          onEmojiClick={onEmojiClickReply}
                                        />
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    disabled={replyLoading || !comment}
                                    className={`${
                                      !comment &&
                                      "cursor-not-allowed opacity-[.5]"
                                    }   ${replyLoading && "cursor-no-drop"} `}
                                  >
                                    {replyLoading ? (
                                      <BiLoaderCircle className="w-4 h-4 animate-spin text-white" />
                                    ) : (
                                      <IoSend
                                        className={`w-4 h-4   ${
                                          !comment
                                            ? "text-gray-500 dark:text-gray-100 cursor-not-allowed"
                                            : "text-orange-600"
                                        }`}
                                      />
                                    )}
                                  </button>
                                </div>
                              </form>
                              {/*------------- All Replies------------ */}
                              <div className=" mt-1 max-h-[15rem] overflow-auto shidden flex flex-col gap-2">
                                {comment?.commentReplies &&
                                  comment?.commentReplies
                                    ?.slice()
                                    ?.reverse()
                                    ?.map((creply) => (
                                      <div
                                        className="flex w-fit items-start gap-1 rounded-lg bg-orange-100 dark:bg-gray-600 py-1 px-2 "
                                        key={creply._id}
                                      >
                                        <div className="w-[2.4rem] h-[2.4rem]">
                                          <div className="relative w-[2.2rem] h-[2.2rem] bg-white dark:bg-gray-800 rounded-full border-2 border-orange-600 overflow-hidden z-20">
                                            <Image
                                              src={
                                                creply?.user?.profilePicture
                                                  ? creply?.user?.profilePicture
                                                  : "/profile.png"
                                              }
                                              alt="Profile"
                                              layout="fill"
                                              className="rounded-lg"
                                            />
                                          </div>
                                        </div>
                                        {/*  */}
                                        <div className="flex flex-col gap-[2px]  ">
                                          <div className="flex items-center justify-between gap-6 ">
                                            <h3 className="text-black text-[14px] dark:text-white font-medium">
                                              {creply?.user?.name?.slice(0, 15)}
                                            </h3>
                                            {/* Post Date */}
                                            <span className="text-[11px] font-light text-gray-500 dark:text-gray-300">
                                              {dateFormat(
                                                new Date(creply?.createdAt),
                                                "MMM dd 'at' p"
                                              )}
                                            </span>
                                          </div>
                                          <p className="text-gray-600 text-[13px] font-light dark:text-gray-200">
                                            {creply?.commentReply}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  {/* --------Add Comments --------*/}
                  <div className="w-full flex items-start gap-2 px-3 sm:px-4  ">
                    <div className="w-[3rem] h-[3rem]">
                      <div className="relative w-[2.8rem] h-[2.8rem] bg-white dark:bg-gray-800 rounded-full border-2 border-orange-600 overflow-hidden z-20">
                        <Image
                          src={
                            auth?.user?.profilePicture
                              ? auth?.user?.profilePicture
                              : "/profile.png"
                          }
                          alt="Profile"
                          layout="fill"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    {/*  */}

                    <form
                      onSubmit={handleComment}
                      className="flex flex-col gap-1 w-full rounded-lg border bg-gray-100  dark:bg-gray-700"
                    >
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onClick={() => setShowPicker(false)}
                        placeholder={`Comment as ${
                          auth?.user?.firstName + " " + auth?.user?.lastName
                        }`}
                        className="w-full h-[2.5rem] sm:h-[3rem] px-2 p-1 rounded-md border-none resize-none outline-none bg-transparent"
                      ></textarea>
                      <div className="flex items-center justify-between px-4 py-1  ">
                        <div className="relative " title="Add Emoji">
                          <span onClick={() => setShowPicker(!showPicker)}>
                            <BsEmojiSmile className="text-yellow-500 hover:text-yellow-600 z-20 h-5 w-5 cursor-pointer" />
                          </span>
                          {showPicker && (
                            <span className="absolute bottom-5 left-0 z-40">
                              <EmojiPicker onEmojiClick={onEmojiClick} />
                            </span>
                          )}
                        </div>

                        <button
                          disabled={isloading || !comment}
                          className={`${
                            !comment && "cursor-not-allowed opacity-[.5]"
                          }   ${isloading && "cursor-no-drop"} shadow`}
                        >
                          {isloading ? (
                            <BiLoaderCircle className="w-5 h-5 animate-spin text-white" />
                          ) : (
                            <IoSend
                              className={`w-5 h-5   ${
                                !comment
                                  ? "text-gray-500 dark:text-gray-100 cursor-not-allowed"
                                  : "text-orange-600"
                              }`}
                            />
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* -----------Share Post---------- */}
        {showShare && (
          <div className="fixed top-0 left-0 w-full h-full bg-white/70 dark:bg-gray-950/70 z-50 flex items-center justify-center">
            <ShareData
              title={postTitle}
              url={`${currentUrl}/postDetail/${postId}`}
              setShowShare={setShowShare}
            />
          </div>
        )}
      </div>
    </UserLayout>
  );
}
