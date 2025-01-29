"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "../../components/Nav";

const CategoriesPage = () => {
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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Nav />
      <div className="container mx-auto px-4 pt-[10px]">
        <h1 className="text-3xl font-bold mb-6 text-center">หมวดหมู่สินค้า</h1>
        <div className="space-y-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/store/${category._id}`}>
              <div className="bg-white p-4 rounded-lg shadow-lg text-center cursor-pointer">
                <img
                  src={category.imageUrl}
                  alt={category.categoryName}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold">{category.categoryName}</h2>
                <p className="text-gray-600 mt-2">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
