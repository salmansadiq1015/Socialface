import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { Style } from "@/app/utils/CommonStyle";
import { FaUserPlus } from "react-icons/fa6";

const usersData = [
  {
    id: 1,
    name: "M Salman",
    image: "https://socialface.s3.eu-north-1.amazonaws.com/1721368731594",
  },
  {
    id: 1,
    name: "M Ali",
    image: "https://socialface.s3.eu-north-1.amazonaws.com/1721153613401",
  },
  {
    id: 1,
    name: "M Sadiq",
    image: "https://socialface.s3.eu-north-1.amazonaws.com/1721153573105",
  },
  {
    id: 1,
    name: "M Moeez",
    image: "https://socialface.s3.eu-north-1.amazonaws.com/1721153478512",
  },
  {
    id: 1,
    name: "M Usman",
    image: "https://socialface.s3.eu-north-1.amazonaws.com/1721153737044",
  },
];

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

export default function AllUsers() {
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
                <div className="w-full relative h-[9rem] border-b flex items-center justify-center overflow-hidden">
                  <Image
                    src={item?.image}
                    alt="cardImage"
                    layout="responsive"
                    width={500}
                    height={130}
                    className="object-fill w-full h-[8rem]"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] sm:text-[16px] font-semibold text-center">
                    {item?.name}
                  </h3>
                </div>
                <div className="px-1 sm:px-3">
                  <button
                    className={`${Style.button1}  rounded-md w-full text-[13px] sm:text-[15px] `}
                  >
                    <FaUserPlus className="h-5 w-5 mr-1 text-white" /> Add
                    Friend
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
