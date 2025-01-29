import React, { useState } from "react";
import { Dialog } from "@radix-ui/themes";
import ToastContainer from "./ToastContainer";
import {toast} from "react-hot-toast";
const ItemModal = ({ item, showModal, setShowModal }) => {
  const [quantity, setQuantity] = useState(1); // State สำหรับจำนวนสินค้า

  if (!item || !showModal) return null; // หากไม่มี item หรือ Modal ถูกปิด ไม่ต้องแสดงอะไร

  const handleBuy = async () => {
    toast.loading(`กำลังดำเนินการ...`, {
      duration: 2000,
      position: 'top-right',
    });
    const user = JSON.parse(localStorage.getItem("user")); // ดึงข้อมูล user จาก Local Storage
    const userId = user?.username; // ใช้ username เป็น userId

    if (!userId) {
      toast.error(`กรุณาเข้าสู่ระบบก่อนทำการซื้อสินค้า!`, {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }

    try {
      const response = await fetch("/api/store/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          itemId: item._id,
          quantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`ซื้อสินค้าเรียบร้อย!`, {
          duration: 2000,
          position: 'top-right',
        });
        window.location.reload();
      } else {
        toast.error(`เกิดข้อผิดพลาด: ${data.message}`, {
          duration: 2000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error("Error buying item:", error);
      toast.error(`เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์!`, {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

return (
    <Dialog.Root open={showModal} onOpenChange={(open) => setShowModal(open)}>
      <Dialog.Content style={{ maxWidth: "450px" }}>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <Dialog.Title>
            <h2 className="text-2xl font-extrabold text-center">{item?.title || "Product Title"}</h2>
          </Dialog.Title>
          <span className="text-sm text-gray-400 font-semibold">
            เหลือ {item?.datas?.length || 0} ชิ้น
          </span>
        </div>

        {/* Product Image */}
        <div className="flex justify-center mb-6">
          <img
            src={item?.image || "/placeholder.png"}
            alt={item?.title || "Product Image"}
            className="w-64 h-64 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Description */}
        <div className="text-center text-base leading-7 space-y-4 font-semibold">
          <p>{item?.description || "รายละเอียดสินค้า"}</p>
        </div>

        {/* Quantity Section */}
        <div className="flex justify-center items-center space-x-2 mt-5">
          {/* Decrease Quantity Button */}
          <button
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
            className="bg-zinc-950 text-white hover:text-purple-600 transition duration-200 text-sm w-[40px] h-[40px] flex justify-center items-center rounded-lg border border-zinc-800"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M432 256c0 17.7-14.3 32-32 32H48c-17.7 0-32-14.3-32-32s14.3-32 32-32h352c17.7 0 32 14.3 32 32z"></path>
            </svg>
          </button>

          {/* Quantity Input */}
          <input
            type="number"
            name="quantity"
            id="quantity"
            className="bg-black px-5 py-2 text-sm border border-zinc-900 rounded-lg w-[70px] text-white"
            min="1"
            max={item?.datas?.length || 1}
            value={quantity}
            onChange={(e) => {
              const value = Math.max(
                1,
                Math.min(Number(e.target.value), item?.datas?.length || 1)
              );
              setQuantity(value);
            }}
          />

          {/* Increase Quantity Button */}
          <button
            onClick={() =>
              setQuantity((prev) =>
                Math.min(prev + 1, item?.datas?.length || 1)
              )
            }
            className="bg-zinc-950 text-white hover:text-purple-600 transition duration-200 text-sm w-[40px] h-[40px] flex justify-center items-center rounded-lg border border-zinc-800"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h176v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h176c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"></path>
            </svg>
          </button>
        </div>

        {/* Price Section */}
        <hr className="my-6 border-gray-700" />
        <p className="text-center text-xl font-extrabold">
          ราคา: <span className="text-purple-400">{(item?.price || 0) * quantity} เครดิต</span>
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleBuy}
            className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700"
          >
            ซื้อสินค้า
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700"
          >
            ยกเลิก
          </button>
        </div>
        <ToastContainer />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ItemModal;