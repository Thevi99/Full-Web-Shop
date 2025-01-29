"use client";

import NavAdmin from "../../components/NavAdmin";
import ToastContainer from "@/app/components/ToastContainer";
import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { Button, AlertDialog, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
const AddCategoryPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // Add Category
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // สำหรับเก็บไฟล์ที่เลือก
  const [categories, setCategories] = useState([]);

  // Edit Category
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);
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
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // เก็บไฟล์ที่เลือก
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("file", file); // ใส่ไฟล์
    formData.append("description", description);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("เพิ่มหมวดหมู่สำเร็จ!", {
          duration: 2000,
          position: "top-right",
        });
        setCategoryName("");
        setDescription("");
        setFile(null);
        router.refresh();
        
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`, {
          duration: 2000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", {
        duration: 2000,
        position: "top-right",
      });
    }
  };
  const handleOpenModal = (category) => {
    setEditCategoryData(category); // เซ็ตข้อมูลหมวดหมู่ที่ต้องการแก้ไข
    setIsModalOpen(true); // เปิด Modal
  };

  const handleCloseModal = () => {
    setEditCategoryData(null); // ล้างข้อมูล
    setIsModalOpen(false); // ปิด Modal
  };
  const handleEditCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      const response = await fetch(
        `/api/admin/categories?id=${editCategoryData._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("แก้ไขหมวดหมู่สำเร็จ!");
        const updatedCategory = await response.json();
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          )
        );
        router.refresh();

        handleCloseModal(); // ปิด Modal หลังจากแก้ไขสำเร็จ
      } else {
        const errorData = await response.json();
        toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`);
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };
  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("ลบหมวดหมู่สำเร็จ!", {
          duration: 2000,
          position: "top-right",
        });
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );
        router.refresh();
      } else {
        toast.error("ไม่สามารถลบหมวดหมู่ได้", {
          duration: 2000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("เกิดข้อผิดพลาดในการลบหมวดหมู่", {
        duration: 2000,
        position: "top-right",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-purple-400">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return <p className="text-center text-white">ไม่มีหมวดหมู่ในขณะนี้</p>;
  }
  return (
    <div className="min-h-screen grid grid-cols-[auto,1fr]">
      {/* <AlertDialogDemo /> */}
      {/* Sidebar */}
      <NavAdmin />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">เพิ่มหมวดหมู่สินค้า</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              ชื่อหมวดหมู่ *
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="ชื่อหมวดหมู่"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">คำอธิบาย</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="คำอธิบาย"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">รูปภาพ *</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
          >
            เพิ่มหมวดหมู่
          </button>
        </form>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mt-5">
          <h1 className="text-3xl font-bold mb-4">หมวดหมู่สินค้า</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, key) => (
              <div
                key={key}
                className="shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
              >
                <img src={category.imageUrl} alt={category.categoryName} />
                <div className="text-center flex justify-center gap-2">
                <Link
                    className="bg-green-500/10 text-green-400 px-4 py-2 rounded-md mt-2"
                    href={`/admin/manage-item?category=${category._id}`}
                  >
                    จัดการสินค้า
                  </Link>
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-md mt-2"
                  >
                    แก้ไข
                  </button>
                  <button  onClick={() => handleDeleteCategory(category._id)} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-md mt-2">
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <AlertDialog.Root open={isModalOpen} onOpenChange={handleCloseModal}>
          <AlertDialog.Content>
            <AlertDialog.Title>
              <span>แก้ไขหมวดหมู่ {editCategoryData?.categoryName}</span>
            </AlertDialog.Title>
            <AlertDialog.Description>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  ชื่อหมวดหมู่ *
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={editCategoryData?.categoryName}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  คำอธิบาย
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={editCategoryData?.description}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  รูปภาพ *
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </AlertDialog.Description>
            <Flex justify="end" mt="4">
              <Button variant="soft" color="gray" onClick={handleCloseModal}>
                <span>ยกเลิก</span>
              </Button>
              <Button
                variant="surface"
                color="blue"
                onClick={handleEditCategory}
              >
                <span>บันทึกการแก้ไข</span>
              </Button>
            </Flex>
            <ToastContainer />
          </AlertDialog.Content>
        </AlertDialog.Root>
      )}
    </div>
  );
};

export default AddCategoryPage;
