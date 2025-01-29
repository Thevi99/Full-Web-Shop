"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "../../components/Nav";
import axios from "axios";

const CategoryPage = () => {
  const params = useParams();
  const { newId } = params;
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`/api/news?newId=${newId}`);
        if (response.data) {
          console.log(response.data.DataNews);
          setNews(response.data.DataNews);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchNews();
  }, [newId]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #1e3a8a, #000000)",
        color: "white",
      }}
    >
      <Nav />
      {news && news.map((item) => (
        <div key={item._id} className="relative z-10 py-28">
          <div className="px-4 lg:px-0 lg:w-[960px] mx-auto">
            <img
              className="w-full mb-6 animate__animated animate__faster animate__zoomIn"
              src={item.image}
              alt="2 ลิงค์สำคัญหาก nav bar บัค_image"
            />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 animate__animated animate__faster animate__fadeIn">
              {item.title}
            </h1>
            <p className="mb-8 animate__animated animate__faster animate__fadeIn">
              {/* ใช้ dangerouslySetInnerHTML เพื่อแสดงผล HTML จาก description */}
              <span
                dangerouslySetInnerHTML={{
                  __html: item.description.replace(/\n/g, "<br />"),
                }}
              />
            </p>
            <div className="text-right text-white/60 animate__animated animate__faster animate__fadeIn">
              <p className="text-xs">อัพโหลดเมื่อ {item.createdAt}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
