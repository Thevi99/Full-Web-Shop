"use client";

import { useState,useEffect } from "react";
import { Switch } from "@radix-ui/themes";
import NavAdmin from "../../components/NavAdmin";
import config from "../../../config.json"; // Import config.json
import ToastContainer from "@/app/components/ToastContainer";
import { toast } from 'react-hot-toast';
const durations = [
  { id: 1, label: "1 วัน", value: 1 },
  { id: 7, label: "7 วัน", value: 7 },
  { id: 30, label: "1 เดือน", value: 30 },
];

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    code: "",
  });
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [keyCount, setKeyCount] = useState("");
  const [licenseKeys, setLicenseKeys] = useState<string[]>([]);


  // COnfig
  const [logo, setLogo] = useState(null);
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [faqyt, setFaqyt] = useState("");
  const [wallet, setWallet] = useState("");
  const [bank, setBank] = useState(null);

  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/setting");
        if (response.ok) {
          const data = await response.json();
          setTitle(data.DataTarget.title)
          setDescription(data.DataTarget.description)
          setFaqyt(data.DataTarget.faqyt)
          setWallet(data.DataTarget.wallet)
          setBank(data.DataTarget.bank)
          setData(data.DataTarget);
        } else {
          console.error("Failed to fetch features");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === "logo") setLogo(files[0]);
      if (name === "video") setVideo(files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("faqyt", faqyt);
    formData.append("wallet", wallet);
    formData.append("bank", bank ? "true" : "false");
    formData.append("logo", logo);
    formData.append("video", video);
  
    try {
      const response = await fetch("/api/admin/setting", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      if (response.status === 200) {
        toast.success("บันทึกข้อมูลสำเร็จ", {
          duration: 2000,
          position: "top-right",
        });
        window.location.reload();
      } else {
        toast.error(result.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล", {
          duration: 2000,
          position: "top-right",
        });
        window.location.reload();

      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล", {
        duration: 2000,
        position: "top-right",
      });
    }
  };
  
  const handleGenerateKeys = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGame || !selectedDuration || !keyCount) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }

    try {
      const response = await fetch("/api/license/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseCount: keyCount,
          licenseName: selectedGame,
          scriptValue: selectedGame,
        }),
      });

      const result = await response.json();
      console.log("Generate Keys Response:", result);

      // ตรวจสอบว่าเรามี licenseKeys ใน response หรือไม่
      if (response.status === 200 && result.licenseKeys && result.licenseKeys.length > 0) {
        toast.success('Generate License สำเร็จ!', {
          duration: 2000,
          position: 'top-right',
        });
        setLicenseKeys(result.licenseKeys);  // Save generated keys to state
        downloadFile(result.licenseKeys);  // Trigger the download after generating keys
      } else {
        toast.error(result.message || "เกิดข้อผิดพลาดในการสร้าง License", {
          duration: 2000,
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error("Error generating keys:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้าง License", {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

  const downloadFile = (keys: string[]) => {
    if (keys && keys.length > 0) {
      // สร้างเนื้อหาของไฟล์
      const keyContent = keys.join("\n");

      // สร้าง Blob
      const blob = new Blob([keyContent], { type: "text/plain" });
      const link = document.createElement("a");

      // สร้าง URL สำหรับไฟล์
      link.href = URL.createObjectURL(blob);
      link.download = "license_keys.txt";  // ตั้งชื่อไฟล์ที่ดาวน์โหลด

      document.body.appendChild(link);  // เพิ่มลิงค์ใน DOM
      link.click();  // เรียกดาวน์โหลด
      document.body.removeChild(link);  // ลบลิงค์หลังจากดาวน์โหลด
    } else {
      toast.error("ไม่มี License Keys สำหรับดาวน์โหลด", {
        duration: 2000,
        position: 'top-right',
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-64 bg-gray-800 text-white">
        <NavAdmin />
      </div>
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        {/* Phone Number Section */}
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-2">Setting Config</h2>
          <p className="text-gray-400 mb-6">Setting Config</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code */}
            <div>
              <label htmlFor="code" className="block font-medium text-gray-300">
                ชื่อเว็บไซต์
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="code" className="block font-medium text-gray-300">
                เบอร์ มือถือ (ที่รับซองอังเปา)
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="code" className="block font-medium text-gray-300">
                คำอธิบายเว็บไซต์
              </label>
              <textarea
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div>
              <label htmlFor="code" className="block font-medium text-gray-300">
                ลิ้งสอนใช้ FAQ
              </label>
              <textarea
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={faqyt}
                onChange={(e) => setFaqyt(e.target.value)}></textarea>
            </div>
            <div>
              <label htmlFor="code" className="block font-medium text-gray-300">
                รูปโลโก้
              </label>
              <input
                type="file"
                name="logo"
                onChange={handleFileChange}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="code" className="block font-medium text-gray-300">
                รูปวิดีโอ
              </label>
              <input
                type="file"
                name="video"
                onChange={handleFileChange}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="code" className="block font-medium text-gray-300">
                ธนาคาร
              </label> 
              <Switch checked={bank} onCheckedChange={(value) => setBank(value)} />

            </div>
            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-items-start">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        </div>

        {/* Generate Keys Section */}
        <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Generate License</h2>
          <p className="text-gray-400 mb-6">สำหรับ generate license keys </p>

          <form onSubmit={handleGenerateKeys} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dropdown เลือกเกม */}
            <div>
              <label htmlFor="game" className="block font-medium text-gray-300">
                เลือกเกม *
              </label>
              <select
                id="game"
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- เลือกเกม --</option>
                {config.games.map((game) => (
                  <option key={game.value} value={game.value}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown เลือกระยะเวลา */}
            <div>
              <label htmlFor="duration" className="block font-medium text-gray-300">
                ระยะเวลา *
              </label>
              <select
                id="duration"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- เลือกระยะเวลา --</option>
                {durations.map((duration) => (
                  <option key={duration.id} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ช่องกรอกจำนวน Key */}
            <div>
              <label htmlFor="keyCount" className="block font-medium text-gray-300">
                จำนวน License *
              </label>
              <input
                type="number"
                id="keyCount"
                value={keyCount}
                onChange={(e) => setKeyCount(e.target.value)}
                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
            </div>

            {/* ปุ่ม Generate License */}
            <div className="md:col-span-2 flex justify-start">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Generate License
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SettingsPage;
