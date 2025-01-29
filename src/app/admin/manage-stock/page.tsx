"use client";

import { useState, useEffect } from "react";
import NavAdmin from "../../components/NavAdmin";
import { motion } from "framer-motion";
import ToastContainer from "@/app/components/ToastContainer";
import { Button, AlertDialog, Flex } from "@radix-ui/themes";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const ManageStock = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const itemId = searchParams.get('itemId')
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-black">
  //         <div className="animate-pulse flex flex-col items-center">
  //           <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
  //           <p className="mt-4 text-lg font-semibold text-purple-400">
  //             กำลังโหลดข้อมูล...
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen flex">
      <NavAdmin />
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700 mb-10">
          <h2 className="text-xl font-bold mb-6">จัดการ Stock</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto rounded-xl shadow-2xl border border-purple-500/30"
          >
            <table className="min-w-full table-auto bg-gray-800/50 backdrop-blur-sm">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <th className="px-6 py-4 text-left">รายการ</th>
                  <th className="px-6 py-4 text-left">ข้อมูล</th>
                  <th className="px-6 py-4 text-center">ราคา</th>
                  <th className="px-6 py-4 text-center">สกุล</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                  <th className="px-6 py-4 text-center">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="hover:bg-purple-600/10 transition-all duration-300"
                  >
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                        <span className="font-medium text-white">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    {/* แก้ไขส่วนนี้ */}
                    <td className="px-6 py-4 text-left text-gray-300">
                      {Array.isArray(item.data)
                        ? item.data.join(", ")
                        : item.data
                        ? item.data
                        : "ไม่มีข้อมูล"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-4 py-1 rounded-full bg-green-500/10 text-green-400 font-semibold">
                        ฿{item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.currency}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1 rounded-full ${
                          item.status === "สำเร็จ"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <div className="flex justify-center mt-8 space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-6 py-2 rounded-full flex items-center ${
                currentPage === 1
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all duration-300"
              }`}
            >
              <span className="mr-2">←</span> ก่อนหน้า
            </motion.button>
            <span className="px-6 py-2 bg-gray-800 rounded-full flex items-center">
              หน้าที่ {currentPage} จาก{" "}
              {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
              }
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-6 py-2 rounded-full flex items-center ${
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all duration-300"
              }`}
            >
              ถัดไป <span className="ml-2">→</span>
            </motion.button>
          </div>
        </div>
      </div>
      {/* {isModalOpen && (
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
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  หมายเหตุ (note)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={editData?.note}
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
      )} */}
      <ToastContainer />
    </div>
  );
};

export default ManageStock;
