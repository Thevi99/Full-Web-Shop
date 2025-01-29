"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Clock, Package } from "lucide-react";
import Nav from "../../components/Nav";
import { useUser } from "@/app/contexts/UserContext";
import axios from "axios";
const HistoryPage = () => {
  const { user, setUser } = useUser();

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredData = historyData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log(user?.username);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const formData = new FormData();
        console.log(user)
        formData.append('daataid', user?.username);
        const response = await axios.post("/api/store/history", {
          daataid: user?.username
        });
        if (response.data) {
          console.log(response.data);
          setHistoryData(response.data.historyData);
        } else {
          console.error("Failed to fetch history data");
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Nav />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              ประวัติการซื้อสินค้า
            </h1>
            <p className="text-gray-400 text-lg">ตรวจสอบรายการซื้อสินค้าทั้งหมดของคุณ</p>
          </motion.div>

          <div className="mb-8">
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="🔍 ค้นหารายการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 rounded-full bg-gray-800 border border-purple-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:outline-none text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center">
                <Package className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-sm text-gray-200">สินค้าทั้งหมด</p>
                  <p className="text-2xl font-bold">{historyData.length}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-pink-600 to-purple-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-sm text-gray-200">ยอดรวม</p>
                  <p className="text-2xl font-bold">
                    ฿{historyData.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

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
                        <span className="font-medium text-white">{item.name}</span>
                      </div>
                    </td>
                    {/* แก้ไขส่วนนี้ */}
                    <td className="px-6 py-4 text-left text-gray-300">
                      {Array.isArray(item.data) ? item.data.join(", ") : item.data ? item.data : "ไม่มีข้อมูล"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-4 py-1 rounded-full bg-green-500/10 text-green-400 font-semibold">
                        ฿{item.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.currency}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1 rounded-full ${item.status === "สำเร็จ"
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
              className={`px-6 py-2 rounded-full flex items-center ${currentPage === 1
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all duration-300"
                }`}
            >
              <span className="mr-2">←</span> ก่อนหน้า
            </motion.button>
            <span className="px-6 py-2 bg-gray-800 rounded-full flex items-center">
              หน้าที่ {currentPage} จาก {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-6 py-2 rounded-full flex items-center ${currentPage === Math.ceil(filteredData.length / itemsPerPage)
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all duration-300"
                }`}
            >
              ถัดไป <span className="ml-2">→</span>
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
