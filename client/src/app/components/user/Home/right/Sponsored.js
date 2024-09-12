"use client";
import SponceredSkelton from "@/app/components/LoadingSkelton/SponceredSkelton";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

const sponsored = [
  {
    _id: 1,
    image: "https://socialface.s3.eu-north-1.amazonaws.com/1722074108549",
    title: "MSc in Financial Engineering",
    website: "https://www.wqu.edu",
    link: "https://www.wqu.edu/mscfe-apply?utm_source=FB&utm_medium=SIA&utm_campaign=QP&utm_id=120209790500890394&utm_content=MScFE+WW&hsa_acc=6623587411002980&hsa_cam=120207093675530394&hsa_grp=120209790500890394&hsa_ad=120209790500870394&hsa_src=fb&hsa_net=facebook&hsa_ver=3&utm_term=120209790500890394&fbclid=IwY2xjawEwXe1leHRuA2FlbQEwAAEdlkEBD0u69sUGkVLlP_8Nnbw_zb-zT7DL2SZ-_rF8vuP6ufy0KiJzBZNG_aem_vR8Zsz1ZMWHMfsfPFyaTUg",
  },
  {
    _id: 2,
    image: "https://socialface.s3.eu-north-1.amazonaws.com/1722091549023",
    title: "MSc in Financial Engineering",
    website: "https://www.wqu.edu",
    link: "https://www.wqu.edu/mscfe-apply?utm_source=FB&utm_medium=SIA&utm_campaign=QP&utm_id=120209790500890394&utm_content=MScFE+WW&hsa_acc=6623587411002980&hsa_cam=120207093675530394&hsa_grp=120209790500890394&hsa_ad=120209790500870394&hsa_src=fb&hsa_net=facebook&hsa_ver=3&utm_term=120209790500890394&fbclid=IwY2xjawEwXe1leHRuA2FlbQEwAAEdlkEBD0u69sUGkVLlP_8Nnbw_zb-zT7DL2SZ-_rF8vuP6ufy0KiJzBZNG_aem_vR8Zsz1ZMWHMfsfPFyaTUg",
  },
  {
    _id: 3,
    image: "https://socialface.s3.eu-north-1.amazonaws.com/1722074108549",
    title: "MSc in Financial Engineering",
    website: "https://www.wqu.edu",
    link: "https://www.wqu.edu/mscfe-apply?utm_source=FB&utm_medium=SIA&utm_campaign=QP&utm_id=120209790500890394&utm_content=MScFE+WW&hsa_acc=6623587411002980&hsa_cam=120207093675530394&hsa_grp=120209790500890394&hsa_ad=120209790500870394&hsa_src=fb&hsa_net=facebook&hsa_ver=3&utm_term=120209790500890394&fbclid=IwY2xjawEwXe1leHRuA2FlbQEwAAEdlkEBD0u69sUGkVLlP_8Nnbw_zb-zT7DL2SZ-_rF8vuP6ufy0KiJzBZNG_aem_vR8Zsz1ZMWHMfsfPFyaTUg",
  },
  {
    _id: 4,
    image: "https://socialface.s3.eu-north-1.amazonaws.com/1722102221192",
    title: "MSc in Financial Engineering",
    website: "https://www.wqu.edu",
    link: "https://www.wqu.edu/mscfe-apply?utm_source=FB&utm_medium=SIA&utm_campaign=QP&utm_id=120209790500890394&utm_content=MScFE+WW&hsa_acc=6623587411002980&hsa_cam=120207093675530394&hsa_grp=120209790500890394&hsa_ad=120209790500870394&hsa_src=fb&hsa_net=facebook&hsa_ver=3&utm_term=120209790500890394&fbclid=IwY2xjawEwXe1leHRuA2FlbQEwAAEdlkEBD0u69sUGkVLlP_8Nnbw_zb-zT7DL2SZ-_rF8vuP6ufy0KiJzBZNG_aem_vR8Zsz1ZMWHMfsfPFyaTUg",
  },
];

export default function Sponsored() {
  const [sponsoreData, setSponsoreData] = useState([]);
  const [loading, setLoading] = useState(false);

  //   Get ALl Sponsored
  const getAllSponsored = async (req, res) => {
    setLoading(false);
    try {
      const { data } = await axios.get();
      if (data?.success) {
        setSponsoreData(data.sponsores);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full  flex flex-col gap-3">
      <h3 className="text-[17px] font-semibold">Sponsored</h3>

      {!loading ? (
        <div className="w-full max-h-[11rem] overflow-y-auto shidden px-1 flex flex-col gap-2">
          {sponsored &&
            sponsored?.map((spon) => (
              <Link
                href={spon?.link}
                key={spon._id}
                className="flex items-center gap-2 cursor-pointer"
                target="_blank"
              >
                <div className="relative w-[9rem] h-[5rem] rounded-lg shadow object-fill overflow-hidden">
                  <Image
                    src={spon?.image}
                    alt="bimage"
                    layout="fill"
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-[14px] font-semibold text-gray-900 dark:text-gray-50">
                    {spon?.title}
                  </h4>
                  <span className="text-[13px] text-gray-700 dark:text-gray-200">
                    {spon?.website}
                  </span>
                </div>
              </Link>
            ))}
        </div>
      ) : (
        <div className="w-full max-h-[11rem] overflow-y-auto shidden px-1 flex flex-col gap-2">
          <SponceredSkelton />
        </div>
      )}
    </div>
  );
}
