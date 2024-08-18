"use client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "./Header";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import Loader from "@/app/utils/Loader";

export default function UserLayout({
  children,
  title,
  description,
  keywords,
  author,
}) {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!auth?.token) {
      const counter = setInterval(() => {
        setCount((prevVal) => {
          if (prevVal === 0) {
            router.push("/authentication");
            clearInterval(counter);
          }
          return prevVal - 1;
        });
      }, 30);
      return () => clearInterval(counter);
    }
    setLoading(false);
  }, [count, router, auth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className=" ">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main className=" min-h-screen overflow-y-hidden  mt-[5.4rem] sm:mt-[3.6rem] dark:bg-gray-950 dark:text-white text-black ">
        {children}
      </main>
    </div>
  );
}

// Default Props

UserLayout.defaultProps = {
  title: "Socialface",
  description:
    "Mern Stack Project with React JS,Next JS, Node JS, Express JS, MongoDB, BootStrap , CSS3, HTML5, JavaScript, & Tailwind CSS ",
  keywords: "Socialface, socialmedia, ",
  author: "M Salman",
};
