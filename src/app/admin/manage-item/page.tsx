"use client";

import { useState, useEffect } from "react";
import NavAdmin from "../../components/NavAdmin";
import ToastContainer from "@/app/components/ToastContainer";
import { Button, AlertDialog, Flex } from "@radix-ui/themes";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSearchParams } from 'next/navigation'

import Link from "next/link";

const ManageItem = () => {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category')
  console.log(categoryId)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Edit Category
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  // const [category, setCategory] = useState(editData?.category || "");
  const [datas, setDatas] = useState("");
  const [discount, setDiscount] = useState("");

  //   const [image, setImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // เก็บไฟล์ที่เลือก
  };
  const handleAddItem = async (ID) => {

    const datasArray = datas.split("\n").filter((data) => data.trim() !== "");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("datas", datasArray);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("categoryId", categoryId);
    formData.append("file", file);
    formData.append("note", note);


    try {
      const response = await fetch(`/api/admin/items?id=${ID}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message, {
          duration: 2000,
          position: 'top-right',
        });
        setTitle("");
        setDescription("");
        setDatas("");
        setPrice(0);
        setNote("");
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`, {
          duration: 2000,
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", {
        duration: 2000,
        position: 'top-right',
      });
    }
  };
  useEffect(() => {
    const fetchDataAPI = async () => {
      try {
        const response = await axios.get(`/api/admin/items?categoryId=${categoryId}`);
        console.log(response.data);

        // ตรวจสอบว่า DataFeatures มีข้อมูลหรือไม่
        if (response.data) {
          setData(response.data.items);
        } else {
          console.error("No features found in the response");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAPI();
  }, []);
  const handleOpenModal = (data) => {
    setEditData(data); // เซ็ตข้อมูลหมวดหมู่ที่ต้องการแก้ไข
    setTitle(data?.title || ""); // เซ็ตค่าเริ่มต้นของชื่อ
    setPrice(data?.price || ""); // เซ็ตค่าเริ่มต้นของราคา
    setDescription(data?.description || ""); // เซ็ตค่าเริ่มต้นของคำอธิบาย
    setDiscount(data?.discount || ""); // เซ็ตค่าเริ่มต้นของส่วนลด
    setIsModalOpen(true); // เปิด Modal
  };

  const handleCloseModal = () => {
    setEditData(null); // ล้างข้อมูล
    setIsModalOpen(false); // ปิด Modal
  };
  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/admin/items?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("ลบสินค้าสำเร็จ!", {
          duration: 2000,
          position: "top-right",
        });
        setData((prevData) => prevData.filter((data) => data._id !== id));
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`, {
          duration: 2000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("เกิดข้อผิดพลาดในการลบสินค้า", {
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

  if (data.length === 0) {
    return <p className="text-center text-white">ไม่มีหมวดหมู่ในขณะนี้</p>;
  }

  return (
    <div className="min-h-screen flex">
      <NavAdmin />
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700 mb-10">
          <h2 className="text-xl font-bold mb-6">จัดการ Item {categoryId}</h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data
            .map((item, key) => (
              <div
                key={key}
                className="shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
              >
                <img src={item.image} alt={item.title} />
                <div className="text-center flex justify-center gap-2">
                  {/* <Link href={`/admin/manage-stock?itemId=${item._id}`} className="bg-green-500/10 text-green-400 px-4 py-2 rounded-md mt-2">
                      สต็อก
                  </Link> */}
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-md mt-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(item._id)}
                    className="bg-red-500/10 text-red-400 px-4 py-2 rounded-md mt-2"
                  >
                    ลบ
                  </button>
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
              <span>แก้ไข {editData?.title}</span>
            </AlertDialog.Title>
            <AlertDialog.Description>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  ชื่อ Item *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={editData?.title}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">ราคา *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={editData?.price}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">รูปภาพ *</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  ส่วนลด (%) *
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={editData?.discount}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  คำอธิบาย *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={editData?.description}
                ></textarea>
              </div>
            </AlertDialog.Description>
            <Flex justify="end" mt="4">
              <Button variant="soft" color="gray" onClick={handleCloseModal}>
                <span>ยกเลิก</span>
              </Button>
              <Button
                variant="surface"
                color="blue"
                onClick={() => handleAddItem(editData?._id)}
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

export default ManageItem;
