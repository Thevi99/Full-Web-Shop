"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Link from "next/link";

const StorePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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

  if (categories.length === 0) {
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
      <div className="relative z-10 container mx-auto pt-28 pb-24">
        <div className="space-y-16">
          <div>
            <h1 className="text-center text-2xl font-bold mb-8 animate__animated animate__faster animate__zoomIn">
              สินค้าประเภท<span className="text-blue-500 font-bold">สต็อก</span>
            </h1>
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 px-4 xl:px-32 transition-all duration-500 ease-in-out"
        >
          {categories.map((category) => (
            <Link key={category._id} href={`/store/${category._id}`}>
              <div
                className="relative bg-slate-800 overflow-hidden transition ease-in-out duration-500 hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 animate__animated animate__faster animate__fadeIn"
              >
                <img
                  src={category.imageUrl}
                  alt={category.categoryName}
                  className="img-fluid rounded-10 mx-auto d-block"
                />
                <div className="p-4 text-center">
                  <h2 className="text-2xl font-semibold text-white">
                    {category.categoryName}
                  </h2>
                  <p className="text-gray-400 mt-2">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default StorePage;
