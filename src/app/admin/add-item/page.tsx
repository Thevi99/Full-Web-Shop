"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import NavAdmin from "../../components/NavAdmin";
import ToastContainer from "@/app/components/ToastContainer";
import { toast } from 'react-hot-toast';
const AddItemPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [datas, setDatas] = useState("");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [newKey, setNewKey] = useState("");
  const [file, setFile] = useState(null); // สำหรับเก็บไฟล์ที่เลือก
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/admin/items");
        console.log("Response Data:", response.data); // ตรวจสอบ response
        setItems(response.data.items || []); // ดึง `items` จาก response
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]); // กรณี error ให้ตั้งค่า items เป็น empty array
      }
    };    

    fetchItems();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // เก็บไฟล์ที่เลือก
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/admin/items");
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();

    const datasArray = datas.split("\n").filter((data) => data.trim() !== "");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("datas", datasArray);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("categoryId", category);
    formData.append("file", file);
    formData.append("note", note);

    // const newItem = {
    //   title,
    //   description,
    //   datas: datasArray,
    //   price,
    //   discount,
    //   categoryId: category,
    //   image: imageUrl,
    //   note,
    // };


    try {
      const response = await fetch("/api/admin/items", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("เพิ่มสินค้าสำเร็จ!", {
          duration: 2000,
          position: 'top-right',
        });
        setTitle("");
        setDescription("");
        setDatas("");
        setPrice(0);
        setImageUrl("");
        setCategory("");
        setNote("");
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

  const handleAddKey = async (e) => {
    e.preventDefault();

    if (!selectedItem || !newKey.trim()) {
      toast.error("กรุณาเลือกสินค้าและกรอก Key ที่ต้องการเพิ่ม", {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }

    const datasArray = datas.split("\n").filter((data) => data.trim() !== "");

    if (datasArray.length === 0) {
      toast.error("กรุณากรอกข้อมูลในช่อง Datas", {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/items/${selectedItem}/add-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: newKey.trim(),
          datas: datasArray,
        }),
      });

      if (response.ok) {
        toast.success("เพิ่ม Key สำเร็จ!", {
          duration: 2000,
          position: 'top-right',
        });
        setNewKey("");
        setSelectedItem("");
        setDatas(""); // Reset ช่องกรอก datas
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

  

  return (
    <div className="min-h-screen flex">
      <NavAdmin />
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-8">เพิ่มสินค้า</h1>

        <div className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700 mb-10">
          <h2 className="text-xl font-bold mb-6">เพิ่มสินค้าใหม่</h2>

          <form
            onSubmit={handleAddItem}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                ชื่อสินค้า *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ชื่อสินค้า"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ลิงก์ภาพสินค้า *
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ราคา *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ราคา"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                หมวดหมู่ *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                รายละเอียดสินค้า
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="รายละเอียดสินค้า (ถ้ามี)"
                rows={4}
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                หมายเหตุ (note)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="กรอกหมายเหตุเพิ่มเติม (ถ้ามี)"
                rows={3}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ส่วนลด (%)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="กรอกส่วนลดเป็นเปอร์เซ็นต์"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                ข้อมูล (datas)
              </label>
              <textarea
                value={datas}
                onChange={(e) => setDatas(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="กรอกข้อมูลหลายบรรทัด (แต่ละบรรทัดคือ 1 ค่า)"
                rows={6}
                required
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
              >
                เพิ่มสินค้า
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-6">เพิ่ม Key สำหรับสินค้า</h2>

          <form
            onSubmit={handleAddKey}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* เลือกสินค้า */}
            <div>
              <label className="block text-sm font-medium mb-1">
                เลือกสินค้า *
              </label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">เลือกสินค้า</option>
                {Array.isArray(items) && items.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>

            </div>

            {/* ช่องกรอก Key ใหม่ */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Key ใหม่ *
              </label>
              <textarea
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="กรอกอะไรก็ได้ ไม่มีผลต่อระบบ"
                rows={6}
                required
              ></textarea>
            </div>

            {/* ช่องกรอก Datas */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                ข้อมูล (Datas)
              </label>
              <textarea
                value={datas}
                onChange={(e) => setDatas(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="กรอกข้อมูลหลายบรรทัด (แต่ละบรรทัดคือ 1 ค่า)"
                rows={6}
              ></textarea>
            </div>

            {/* ปุ่มเพิ่ม Key */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
              >
                เพิ่ม Key
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddItemPage;
