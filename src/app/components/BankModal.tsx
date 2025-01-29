"use client";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Dialog } from "@radix-ui/themes";
import Image from "next/image";
import axios from "axios";
const BankModal = ({ showModal, setShowModal }) => {
  const [amountData, setAmountData] = useState("");
  const [refData, setRefData] = useState("");
  const [qrcodeData, setQrcodeData] = useState("");
  const [isCreate, setIsCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // สำหรับแสดงข้อความแจ้งเตือน
  const [user, setUser] = useState(null);

  const transactionInterval = useRef(null); // ใช้ useRef เพื่อเก็บค่าของ setInterval

  // useEffect เพื่อดึงข้อมูล user จาก localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const startTransactionLoop = (data) => {
    setIsCreate(true);
    setQrcodeData(data.qrcode);
    setRefData(data.ref);
    // เริ่มต้นการลูปตรวจสอบธุรกรรม
    transactionInterval.current = setInterval(async () => {
      try {
        // เรียก API เพื่อตรวจสอบสถานะธุรกรรม
        const response = await axios.post("/api/bank/transaction", {
          userId: user.username,
          ref: data.ref,
        });
        console.log(response.data);
        // ตรวจสอบสถานะการทำธุรกรรม
        if (response.data.status === "success") {
          const updatedUser = { ...user, credits: response.data.totalCredits };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          clearInterval(transactionInterval.current);
          setNotification({
            type: "success",
            message: response.data.message,
          });
          window.location.reload();
        }
      } catch (error) {
        console.error("Error during transaction check:", error);
        clearInterval(transactionInterval.current);
        setNotification({
          type: "error",
          message: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์",
        });
      }
    }, 3000);
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!amountData) {
      setNotification({ type: "error", message: "กรุณากรอกจำนวนเงิน" });
      return;
    }
    setLoading(true); // เริ่มโหลด
    try {
      const response = await fetch("/api/bank/qrcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.username, amount: amountData }),
      });

      const data = await response.json();
      if (response.ok) {
        startTransactionLoop(data); // เริ่มต้นการลูปเมื่อ QRCODE ถูกสร้าง
      } else {
        setNotification({
          type: "error",
          message: data.message || "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      console.error("Error during top up:", error);
      setNotification({
        type: "error",
        message: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์",
      });
    } finally {
      setLoading(false); // จบการโหลด
    }
  };
  return (
    <Dialog.Root open={showModal} onOpenChange={(open) => setShowModal(open)}>
      <Dialog.Content>
      <Dialog.Title>
          <h2 className="text-2xl font-extrabold text-center">
          เติมเงินโดยระบบอังเปา
          </h2>
        </Dialog.Title>
        {/* Qrcode */}
        {isCreate && (
          <div className="mb-6 text-center">
            <center>
              <Image src={qrcodeData} alt="Qrcode" width={400} height={400} />
            </center>
            <div className="text-sm text-red-500 pt-5">
              อย่ารีเฟรชหน้านี้ก่อนทำรายการสำเร็จ
            </div>
            <div className="text-sm text-gray-500 pt-5">ref: {refData}</div>
          </div>
        )}
        {notification && (
          <div
            className={`p-3 mb-4 pt-5 rounded-lg ${
              notification.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {notification.message}
          </div>
        )}
        <form onSubmit={handleTopUp}>
          <div className="mb-6">
            <input
              value={amountData}
              onChange={(e) => setAmountData(e.target.value)}
              type="number"
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
              placeholder="ใส่จำนวนเงิน"
              min={1}
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : isCreate
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
              disabled={loading || isCreate}
            >
              {loading
                ? "กำลังสร้าง Qrcode..."
                : isCreate
                ? "สร้าง Qrcode เสร็จสิ้นกรุณาจ่ายเงินภายใน 3นาที"
                : "สร้าง Qrcode"}
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default BankModal;
