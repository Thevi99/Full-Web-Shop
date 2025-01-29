"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Link from "next/link";
import axios from "axios";

const FeaturePage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const response = await axios.get("/api/news", {
                    headers: {
                        "Cache-Control": "no-cache", // ป้องกันการใช้แคช
                    },
                });
                console.log(response.data);

                // ตรวจสอบว่า DataFeatures มีข้อมูลหรือไม่
                if (response.data && response.data.DataNews) {
                    setNews(response.data.DataNews);
                } else {
                    console.error("No features found in the response");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatures();
    }, []);

    if (loading) {
      return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-black">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-semibold text-purple-400">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      );
    }

    if (news.length === 0) {
        return <p className="text-center text-white">ไม่มีข่าวในขณะนี้</p>;
    }

    return (
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(to bottom, #1e3a8a, #000000)",
          color: "white",
        }}
      >
        <Nav />
        <div className="relative z-10 container mx-auto pt-28 pb-24 px-4">
          <div className="flex justify-center mb-8">
            <div className="animate__animated animate__faster animate__zoomIn">
              <h1 className="text-8xl w-fit font-bold text-blue-500 -skew-x-12 tracking-tighter">
                RoyX
              </h1>
              <p className="text-2xl w-fit font-bold uppercase -skew-x-12 -translate-y-4 translate-x-28 tracking-[10px]">
                news
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 animate__animated animate__faster animate__fadeIn">
            {news.map((item, index) => (
              <Link
                key={index}
                className="relative bg-slate-800 transition ease-in-out duration-500 hover:cursor-pointer hover:scale-[1.0125] hover:shadow-xl hover:shadow-blue-500/40"
                href={`/news/${item._id}`}
            >
              <img
                className="h-[250px] w-full object-cover"
                src={item.image}
                alt="2 ลิงค์สำคัญหาก nav bar บัค_image"
              />
              <div className="p-6 pb-14 border-t-2 border-blue-500">
                <h1 className="text-2xl font-bold mb-4">
                  {item.title}
                </h1>
                <p className="absolute bottom-6 left-6 text-xs text-white/40">
                  {item.createdAt}
                </p>
              </div>
            </Link>
            ))}
          </div>
        </div>
      </div>
    );
};

export default FeaturePage;
