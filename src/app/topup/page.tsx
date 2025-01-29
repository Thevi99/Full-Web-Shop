"use client";

import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import WalletModal from "../components/WalletModal";
import BankModal from "../components/BankModal";
import axios from "axios";
const TopUpPage = () => {
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null); // สำหรับแสดงข้อความแจ้งเตือน
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalBank, setShowModalBank] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
    const fetchConfigSetting = async () => {
      try {
        const response = await axios.get(`/api/config`);
        console.log(response.data);
        setConfig(response.data);
      } catch (error) {
        console.error("Error fetching config settings:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchConfigSetting(); // เรียกฟังก์ชันที่นี่
  }, []);
  

  const handleShowDetails = () => {
    setShowModal(true);
  };
  const handleShowDetailsBank = () => {
    setShowModalBank(true);
  };
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
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #1e3a8a, #000000)", // พื้นหลังเหมือนหน้าอื่นๆ
      }}
    >
      <Nav />

      <div className="relative z-10 container mx-auto py-28">
        <h1 className="text-center text-2xl font-bold mb-8 animate__animated animate__faster animate__zoomIn">
          คุณต้องการจะ<span className="text-blue-500">เติมเงิน</span>แบบไหนดี?
        </h1>
        <div className="flex mb-6 flex-wrap justify-center gap-8 animate__animated animate__faster animate__fadeIn">
          <button onClick={() => handleShowDetails()}
            className="relative p-6 bg-cover bg-center w-[350px] h-[200px] border-t-2 border-blue-500 transition ease-in-out duration-500 hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgb(30, 41, 59) 20%, rgba(30, 41, 59, 0.8) 80%), url(https://cdn.aona.co.th/1idlkgpdn/TW.jpg)"
            }}            
          >
            <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-t from-blue-500 to-blue-300 -skew-x-12">
              อังเปา
            </h1>
            <p className="text-2xl font-semibold translate-x-2 -translate-y-5 -skew-x-12">
              ทรูมันนี่
            </p>
            <p className="absolute right-6 bottom-6 text-sm text-white/40">
              คลิกที่นี่เพื่อเริ่มทำการจ่ายเงินได้เลย!
            </p>
          </button>
          {config.bank && (
            <button onClick={() => handleShowDetailsBank()}
            className="relative p-6 bg-cover bg-center w-[350px] h-[200px] border-t-2 border-blue-500 transition ease-in-out duration-500 hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgb(30, 41, 59) 20%, rgba(30, 41, 59, 0.8) 80%), url(https://cdn.aona.co.th/1ie1oepe9/pb.jpg)"
            }}            
          >
            <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-t from-blue-500 to-blue-300 -skew-x-12">
              สแกนจ่าย
            </h1>
            <p className="text-2xl font-semibold translate-x-2 -translate-y-5 -skew-x-12">
              ธนาคาร
            </p>
            <p className="absolute right-6 bottom-6 text-sm text-white/40">
              คลิกที่นี่เพื่อเริ่มทำการจ่ายเงินได้เลย!
            </p>
          </button>
          )}
        </div>
      </div>
      {showModal &&(
        <WalletModal showModal={showModal} setShowModal={setShowModal} />
      )}
      {showModalBank &&(
        <BankModal showModal={showModalBank} setShowModal={setShowModalBank} />
      )}
    </div>
  );
};

export default TopUpPage;
