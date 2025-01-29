"use client";

import { useEffect, useState } from "react";
import NavAdmin from "../../components/NavAdmin";
import ToastContainer from "@/app/components/ToastContainer";
import { toast } from "react-hot-toast";
import { Button, Flex } from "@radix-ui/themes";
import * as AlertDialog from "@radix-ui/react-alert-dialog"; 
const AddFeaturesPage = () => {
  const [NewsName, setNewsName] = useState("");
  const [file, setFile] = useState(null); // สำหรับเก็บไฟล์ที่เลือก
  const [Descript, setDescript] = useState("");
  const [loading, setLoading] = useState(false); // ใช้จัดการสถานะการโหลด
  const [message, setMessage] = useState(""); // สำหรับแสดงข้อความตอบกลับ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);
  const [news, setNews] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/news");
        if (response.ok) {
          const data = await response.json();
          setNews(data.DataTarget);
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

    if (!NewsName || !file || !Descript) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", {
        duration: 2000,
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", NewsName);
    formData.append("file", file); // ใส่ไฟล์
    formData.append("description", Descript);

    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        body: formData, // ใช้ FormData
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("เพิ่มฟีเจอร์สำเร็จ!", {
          duration: 2000,
          position: "top-right",
        });
        setNewsName("");
        setFile(null);
        setDescript("");
        setMessage(data.message || "เพิ่มสำเร็จ");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`, {
          duration: 2000,
          position: "top-right",
        });
        setMessage(errorData.message || "เกิดข้อผิดพลาดในการเพิ่มฟีเจอร์");
      }
    } catch (error) {
      console.error("Error submitting feature:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", {
        duration: 2000,
        position: "top-right",
      });
      setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };
  const handleOpenModal = (data) => {
    setNewsName(data.title)
    setDescript(data.description)
    setEditCategoryData(data); // เซ็ตข้อมูลหมวดหมู่ที่ต้องการแก้ไข
    setIsModalOpen(true); // เปิด Modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditCategoryData(null);
    setNewsName("");
    setDescript("");
    setFile(null);
  };
  const handleEditCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", NewsName);
    formData.append("description", Descript);
    if (file) {
      formData.append("file", file);
    }
  
    try {
      const response = await fetch(`/api/admin/news?id=${editCategoryData._id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (response.ok) {
        toast.success("แก้ไขข่าวสารสำเร็จ!");
        window.location.reload();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };
  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/admin/news?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("ลบหมวดหมู่สำเร็จ!", {
          duration: 2000,
          position: "top-right",
        });
        setNews((prevNews) => prevNews.filter((news) => news._id !== id));
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
        <h2 className="text-2xl font-bold mb-2">New</h2>
        <p className="text-gray-400 mb-6">จัดการข่าวสาร</p>

        <form onSubmit={handleSubmit}>
          {/* ชื่อฟีเจอร์ */}
          <div className="mb-3">
            <label
              htmlFor="featuresName"
              className="block font-medium text-gray-300"
            >
              หัวเรื่อง
            </label>
            <input
              type="text"
              id="featuresName"
              value={NewsName}
              onChange={(e) => setNewsName(e.target.value)}
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
                คำอธิบาย
              </label>
              <textarea
                id="description"
                value={Descript}  // Use value here instead of setting children
                onChange={(e) => setDescript(e.target.value)}  // Update state on change
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
              {loading ? "กำลังเพิ่ม..." : "เพิ่มข่าวสาร"}
            </button>
          </div>
        </form>
        <div className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 animate__animated animate__faster animate__fadeIn">
            {news.map((item, index) => (
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
        {isModalOpen && (
          <AlertDialog.Root open={isModalOpen}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="absolute inset-0 bg-black/50 z-40" />
              <AlertDialog.Content
                className="absolute inset-0 m-auto z-50 bg-gray-800 text-white rounded-lg p-6 w-[90vw] max-w-md max-h-[80vh] overflow-y-auto shadow-xl"
                style={{
                  top: "50%",
                  left: "30%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <AlertDialog.Title className="text-xl font-bold mb-4">
                  แก้ไข {editCategoryData?.title}
                </AlertDialog.Title>
                <form onSubmit={handleEditCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      หัวเรื่อง
                    </label>
                    <input
                      type="text"
                      value={NewsName || ""}
                      onChange={(e) => setNewsName(e.target.value)}
                      className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="กรุณากรอกหัวเรื่อง"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      คำอธิบาย
                    </label>
                    <textarea
                      value={Descript || ""}
                      onChange={(e) => setDescript(e.target.value)}
                      className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="กรุณากรอกคำอธิบาย"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      รูปภาพ
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <AlertDialog.Cancel asChild>
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        onClick={handleCloseModal}
                      >
                        ยกเลิก
                      </button>
                    </AlertDialog.Cancel>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      บันทึก
                    </button>
                  </div>
                </form>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddFeaturesPage;
