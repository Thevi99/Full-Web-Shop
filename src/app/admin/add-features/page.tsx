"use client";

import { useState, useEffect } from "react";
import NavAdmin from "../../components/NavAdmin";
import ToastContainer from "@/app/components/ToastContainer";
import { toast } from 'react-hot-toast';
import { Button, AlertDialog, Flex } from "@radix-ui/themes";
import { Link } from 'next/link';
const AddFeaturesPage = () => {
  const [featuresName, setFeaturesName] = useState("");
  const [file, setFile] = useState(null); // สำหรับเก็บไฟล์ที่เลือก
  const [linkk, setLinkk] = useState("");
  const [loading, setLoading] = useState(false); // ใช้จัดการสถานะการโหลด
  const [message, setMessage] = useState(""); // สำหรับแสดงข้อความตอบกลับ
  const [features, setFeatures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);
  const handleOpenModal = (data) => {
    setFeaturesName(data.title)
    setLinkk(data.link)
    setEditCategoryData(data); // เซ็ตข้อมูลหมวดหมู่ที่ต้องการแก้ไข
    setIsModalOpen(true); // เปิด Modal
  };

  const handleCloseModal = () => {
    setEditCategoryData(null); // ล้างข้อมูล
    setIsModalOpen(false); // ปิด Modal
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/features/features");
        if (response.ok) {
          const data = await response.json();
          setFeatures(data.DataTarget);
        } else {
          console.error("Failed to fetch features");
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

    if (!featuresName || !file || !linkk) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("featuresName", featuresName);
    formData.append("file", file); // ใส่ไฟล์
    formData.append("linkk", linkk);

    try {
      const response = await fetch("/api/admin/features/features", {
        method: "POST",
        body: formData, // ใช้ FormData
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("เพิ่มฟีเจอร์สำเร็จ!", {
          duration: 2000,
          position: 'top-right',
        });
        setFeaturesName("");
        setFile(null);
        setLinkk("");
        setMessage(data.message || "เพิ่มฟีเจอร์สำเร็จ");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`, {
          duration: 2000,
          position: 'top-right',
        });
        setMessage(errorData.message || "เกิดข้อผิดพลาดในการเพิ่มฟีเจอร์");
      }
    } catch (error) {
      console.error("Error submitting feature:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", {
        duration: 2000,
        position: 'top-right',
      });
      setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };
  const handleEditCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", featuresName);
    formData.append("link", linkk);
    if (file) formData.append("file", file);

    try {
      const response = await fetch(
        `/api/admin/features/features?id=${editCategoryData._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("แก้ไขสำเร็จ!");
        const updatedNews = await response.json();
        setFeatures((prev) =>
          prev.map((cat) => (cat.id === updatedNews.id ? updatedNews : cat))
        );
        handleCloseModal(); // ปิด Modal หลังจากแก้ไขสำเร็จ
        window.location.reload();
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
      const response = await fetch(`/api/admin/features/features?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("ลบหมวดหมู่สำเร็จ!", {
          duration: 2000,
          position: "top-right",
        });
        setFeatures((prevFeatures) => prevFeatures.filter((features) => features._id !== id));
        window.location.reload();
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
  return (
    <div className="min-h-screen grid grid-cols-[auto,1fr]">
      {/* Sidebar */}
      <NavAdmin />
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-2">Features</h2>
        <p className="text-gray-400 mb-6">จัดการฟีเจอร์</p>

        <form onSubmit={handleSubmit}>
          {/* ชื่อฟีเจอร์ */}
          <div className="mb-3">
            <label htmlFor="featuresName" className="block font-medium text-gray-300">
              ชื่อฟีเจอร์
            </label>
            <input
              type="text"
              id="featuresName"
              value={featuresName}
              onChange={(e) => setFeaturesName(e.target.value)}
              className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* อัปโหลดรูป */}
          <div className="mb-3">
            <label htmlFor="file" className="block font-medium text-gray-300">
              รูป
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* ลิงก์ */}
          <div className="mb-3">
            <label htmlFor="linkk" className="block font-medium text-gray-300">
              ลิงก์
            </label>
            <input
              type="text"
              id="linkk"
              value={linkk}
              onChange={(e) => setLinkk(e.target.value)}
              className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* ปุ่มเพิ่มฟีเจอร์ */}
          <div className="md:col-span-2 flex justify-items-start">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
              disabled={loading} // ปิดปุ่มขณะโหลด
            >
              {loading ? "กำลังเพิ่ม..." : "เพิ่มฟีเจอร์"}
            </button>
          </div>
        </form>

        <div className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 animate__animated animate__faster animate__fadeIn">
            {features.map((item, index) => (
              <div
                key={index}
                className="relative bg-slate-800 transition ease-in-out duration-500 hover:cursor-pointer hover:scale-[1.0125] hover:shadow-xl hover:shadow-blue-500/40"
              >
                <img
                  className="h-[250px] w-full object-cover"
                  src={item.image}
                  alt="2 ลิงค์สำคัญหาก nav bar บัค_image"
                />
                <div className="p-6 pb-14 border-t-2 border-blue-500">
                  <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
                  <div className="text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-md mt-2"
                    >
                      แก้ไข
                    </button>
                    <button onClick={() => handleDeleteCategory(item._id)} className="bg-red-500/10 text-red-400 px-4 py-2 rounded-md mt-2">
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
          <AlertDialog.Root open={isModalOpen} onOpenChange={handleCloseModal}>
            <AlertDialog.Content>
              <AlertDialog.Title>
                <span>แก้ไข {editCategoryData?.title}</span>
              </AlertDialog.Title>
              <AlertDialog.Description>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    ชื่อหมวดหมู่ *
                  </label>
                  <input
                    type="text"
                    value={featuresName}
                    onChange={(e) => setFeaturesName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder={editCategoryData?.title}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    link
                  </label>
                  <input
                    type="text"
                    value={linkk}
                    onChange={(e) => setLinkk(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder={editCategoryData?.link}
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
      <ToastContainer />
    </div>
  );
};

export default AddFeaturesPage;
