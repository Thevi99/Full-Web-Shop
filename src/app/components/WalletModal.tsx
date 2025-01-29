"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@radix-ui/themes";
import Image from "next/image";
const WalletModal = ({ showModal, setShowModal }) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // สำหรับแสดงข้อความแจ้งเตือน
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!voucherCode) {
      setNotification({ type: "error", message: "กรุณากรอกโค้ดบัตรเติมเงิน" });
      return;
    }

    if (!user) {
      setNotification({
        type: "error",
        message: "กรุณาเข้าสู่ระบบก่อนทำการเติมเงิน",
      });
      return;
    }

    setLoading(true); // เริ่มโหลด
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.username, voucherCode }), // ส่ง userId และ voucherCode
      });

      const data = await response.json();
      if (response.ok) {
        // อัปเดตเครดิตใน localStorage และ state
        const updatedUser = { ...user, credits: data.totalCredits };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setNotification({
          type: "success",
          message: `เติมเงินสำเร็จ! ยอดเงินรวมของคุณคือ: ${data.totalCredits} 💰`,
        });
        setVoucherCode(""); // ล้างค่าในช่องกรอก
        window.location.reload();
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
        <div className="flex justify-between items-center mb-6">
        </div>
        <div className="mb-6">
          <img
            src="https://img2.pic.in.th/pic/True_Money_Wallet.jpeg"
            alt="TrueMoney Voucher"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        {notification && (
          <div
            className={`p-3 mb-4 rounded-lg ${
              notification.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {notification.message}
          </div>
        )}
        <form onSubmit={handleTopUp}>
          <div className="mb-6">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
              placeholder="ใส่ลิ้ง"
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
              disabled={loading}
            >
              {loading ? "กำลังเติมเงิน..." : "เติมเงินเลย"}
            </button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WalletModal;
