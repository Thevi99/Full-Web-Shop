"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Link from "next/link";
import axios from "axios";

const FeaturePage = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get("/api/features", {
          headers: {
            "Cache-Control": "no-cache", // ป้องกันการใช้แคช
          },
        });
        console.log(response.data);
        
        // ตรวจสอบว่า DataFeatures มีข้อมูลหรือไม่
        if (response.data && response.data.DataFeatures) {
          setFeatures(response.data.DataFeatures);
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

  if (features.length === 0) {
    return <p className="text-center text-white">ไม่มีหมวดหมู่ในขณะนี้</p>;
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
            <p className="text-2xl w-fit font-bold uppercase -skew-x-12 -translate-y-4 translate-x-8 tracking-[10px]">
              features
            </p>
          </div>
        </div>
        {features.map((feature) => (
          <div key={feature._id} className="space-y-16 animate__animated animate__faster animate__fadeIn">
            <div className="md:w-[600px] mx-auto">
              <div className="relative w-full p-6 flex justify-center mb-4">
                <img
                  className="absolute top-0 left-0 w-full h-full object-cover object-center opacity-25 blur-sm"
                  src={feature.image}
                  alt="feature_image"
                />
                <img
                  className="relative sm:h-[300px]"
                  src={feature.image}
                  alt="feature_image"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-500">
                  {feature.title}
                </h1>
                <div className="mt-2 flex">
                  <Link
                    className="block w-fit -skew-x-12 text-xs px-4 py-0.5 bg-blue-500 whitespace-nowrap transition duration-500 ease-in-out hover:bg-blue-700 font-bold"
                    href={feature.link}
                  >
                    View Showcase
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturePage;
