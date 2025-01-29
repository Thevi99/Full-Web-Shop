"use client";

import { useState, useEffect } from "react";
import NavAdmin from "../../components/NavAdmin";
import ToastContainer from "@/app/components/ToastContainer";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, AlertDialog, Flex } from "@radix-ui/themes";
import axios from "axios";
import { set } from "mongoose";
const AddFAQPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  // Edit Category
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);
    try {
      const response = await fetch("/api/admin/faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          answer: answer,
        }),
      });

      if (response.ok) {
        toast.success("สำเร็จ!", {
          duration: 2000,
          position: "top-right",
        });
        setQuestion("");
        setAnswer("");
        window.location.reload();
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
  useEffect(() => {
    const fetchDataAPI = async () => {
      try {
        const response = await axios.get("/api/admin/faq");
        console.log(response.data);

        // ตรวจสอบว่า DataFeatures มีข้อมูลหรือไม่
        if (response.data) {
          setData(response.data.DataTarget);
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
    setQuestion(data.question)
    setAnswer(data.answer)
    setIsModalOpen(true); // เปิด Modal
  };

  const handleCloseModal = () => {
    setEditData(null); // ล้างข้อมูล
    setIsModalOpen(false); // ปิด Modal
  };
  const handleEditCategory = async (e) => {
    e.preventDefault();

    const data = {
      question: question,
      answer: answer,
    };

    try {
      const response = await fetch(`/api/admin/faq?id=${editData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // กำหนด Content-Type เป็น application/json
        },
        body: JSON.stringify(data), // ส่งข้อมูลในรูปแบบ JSON
      });

      if (response.ok) {
        toast.success("แก้ไขหมวดหมู่สำเร็จ!");
        const updatedData = await response.json();
        setData((prev) =>
          prev.map((data) => (data.id === updatedData.id ? updatedData : data))
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
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("ลบหมวดหมู่สำเร็จ!", {
          duration: 2000,
          position: "top-right",
        });
        setData((prevData) => prevData.filter((data) => data._id !== id));
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
    <div className="min-h-screen grid grid-cols-[auto,1fr] bg-gray-800 text-white">
      {/* Sidebar */}
      <NavAdmin />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">FAQ</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">คำถาม *</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="คำถาม"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">คำตอบ</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="คำตอบ"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
          >
            เพิ่ม
          </button>
        </form>
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700 mt-10">
          <h1 className="text-3xl font-bold mb-4">คำถามทั้งหมด</h1>
          {data.map((data, key) => (
            <div className="space-y-16" key={key}>
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${key}`}>
                  <AccordionTrigger>{data.question}</AccordionTrigger>
                  <AccordionContent>
                    {data.answer}
                    <div className="text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(data)}
                        className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-md mt-2"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(data._id)}
                        className="bg-red-500/10 text-red-400 px-4 py-2 rounded-md mt-2"
                      >
                        ลบ
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <AlertDialog.Root open={isModalOpen} onOpenChange={handleCloseModal}>
          <AlertDialog.Content>
            <AlertDialog.Title>
              <span>แก้ไขคำถาม</span>
            </AlertDialog.Title>
            <AlertDialog.Description>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  คำถาม *
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={editData?.question}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  คำตอบ *
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={editData?.answer}
                  required
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

export default AddFAQPage;
