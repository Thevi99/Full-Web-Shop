"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import {
  AiOutlineInfoCircle,
  AiOutlineGift,
  AiOutlineDownload,
  AiOutlineReload,
  AiOutlineCode, // เพิ่มไอคอนนี้
  AiOutlineDashboard,
} from "react-icons/ai";
import ToastContainer from "./ToastContainer";
import { toast } from 'react-hot-toast';

function NavScript() {
  const { user } = useUser();
  const [activePage, setActivePage] = useState<string>("Infos");
  const [scriptKey, setScriptKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [redeemSuccess, setRedeemSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [credits, setCredits] = useState<number>(0);
  const [rewards, setRewards] = useState<number>(0);
  const [mongoStatus, setMongoStatus] = useState<string>("Checking...");
  const [showRedeemModal, setShowRedeemModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);


  const menuItems = [
    { name: "Infos", icon: <AiOutlineInfoCircle size={24} /> },
    { name: "Redeem", icon: <AiOutlineGift size={24} /> },
    { name: "Get Script", icon: <AiOutlineCode size={24} /> },
    { name: "Reset HWID", icon: <AiOutlineReload size={24} /> },
  ];
  
  // ถ้า Role ของ User เป็น Admin ให้เพิ่มเมนู Admin Dashboard
  if (user?.role === "Admin") {
    menuItems.push({ name: "Admin Dashboard", icon: <AiOutlineDashboard size={24} /> });
  }
  
  
  useEffect(() => {
    if (user) {
      console.log("User data in Context:", user);
      fetch("/api/user/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordId: user.username }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setMongoStatus("Failed to load user data");
          } else {
            setCredits(data.credits || 0);
            setRewards(data.rewards || 0);
            setMongoStatus("User data loaded successfully");
          }
        })
        .catch(() => setMongoStatus("Failed to load user data"));
    }
  }, [user]);

  useEffect(() => {
    if (activePage === "Get Script") {
      handleGetScript(); // Automatically fetch script key when opening "Get Script"
    }
  }, [activePage]);

  const handleGetScript = async () => {
    try {
      if (!user || !user.username) {
        setError("Discord ID not found. Please log in.");
        return;
      }
  
      const discordId = user.username.startsWith("dc_")
        ? user.username.substring(3)
        : user.username;
  
      const response = await fetch("/api/user/get-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: discordId }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch script");
      }
  
      // สร้าง License Key ในรูปแบบ "encryptedData:tag"
      const licenseKey = `${data.encryptedData}:${data.tag}`;
  
      setScriptKey(licenseKey); // เก็บ License Key ใน state
      setError("");
      setShowModal(true); // แสดง modal หลังจากดึง script สำเร็จ
    } catch (err: any) {
      console.error("Error fetching script:", err);
      setError(err.message || "Failed to fetch script");
    }
  };
  

  const handleRedeem = async (key: string) => {
    try {
      if (!user || !user.username) {
        setError("Discord ID not found. Please log in.");
        return;
      }
  
      const discordId = user.username.startsWith("dc_")
        ? user.username.substring(3)
        : user.username;
  
      const response = await fetch("/api/license/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: key, userid: discordId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setRedeemSuccess(true);
        setError("");
        setShowRedeemModal(true); // แสดง modal เมื่อ redeem สำเร็จ
      } else {
        setError(data.message || "Failed to redeem key.");
      }
    } catch (err) {
      console.error("Error redeeming key:", err);
      setError("Failed to redeem key.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`_G.Key = '${scriptKey}'\nloadstring(game:HttpGet('https://raw.githubusercontent.com/rayrei0112/zetahub_loard/main/zetahub.lua'))();`);
    toast.success('Copied to clipboard!', {
      duration: 2000,
      position: 'top-right',
    });
  };

  const handleShowModal = () => {
    setShowModal(false); // ปิด Modal ก่อน
    setTimeout(() => {
      setShowModal(true); // เปิด Modal หลังจาก 100ms
    }, 100); // ดีเลย์ 100ms
  };
  

  const handleResetHwid = async () => {
    try {
      if (!user || !user.username) {
        setError("Discord ID not found. Please log in.");
        return;
      }
  
      const discordId = user.username.startsWith("dc_")
        ? user.username.substring(3)
        : user.username;
  
      const response = await fetch("/api/user/reset-hwid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: discordId }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Failed to reset HWID");
        return; // ไม่ต้อง throw error เพื่อป้องกันการแสดง overlay
      }
  
      setShowResetModal(true);
      setError(""); // ล้าง error เมื่อสำเร็จ
    } catch (err) {
      console.error("Error resetting HWID:", err);
      setError(err.message || "Failed to reset HWID");
    }
  };
  
  
  

  
  

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="flex flex-col h-full w-20 bg-gray-800 text-white shadow-lg">
        <nav className="flex flex-col items-center py-4 space-y-6 pt-20">
          {menuItems.map((item) => (
            <div className="relative group " key={item.name}>
              <button
                onClick={() => setActivePage(item.name)}
                className={`flex items-center justify-center w-14 h-14 rounded-lg ${
                  activePage === item.name ? "bg-blue-500 text-white" : "hover:text-blue-400"
                }`}
              >
                {item.icon}
              </button>
              <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.name}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center mt-10 bg-gray-800 text-white rounded-md border border-gray-700 shadow-md">
        {activePage === "Infos" && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-6 text-gray-300">User Info</h2>
            <p>Discord Username: {user?.nickname || "Not Logged In"}</p>
            <p>MongoDB Status: {mongoStatus}</p>
            <p>Credits: {credits} 💰</p>
            <p>Rewards: {rewards} 🏆</p>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        )}

        {activePage === "Redeem" && (
          <div className="w-full max-w-md text-center">
            {redeemSuccess ? (
              <div>
                <h2 className="text-xl font-bold mb-6 text-gray-300">Redeem Key</h2>
                <p className="mb-6 text-green-500">Redeem completed successfully!</p>
                <button
                  onClick={() => setRedeemSuccess(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-md"
                >
                  OK
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-6 text-gray-300">Redeem Key</h2>
                {error && <p className="text-red-500 mb-6">{error}</p>}
                <input
                  type="text"
                  placeholder="Enter your key"
                  className="w-full px-4 py-3 mb-6 border border-gray-600 rounded-md bg-gray-700 text-white"
                  onChange={(e) => setScriptKey(e.target.value)}
                />
                <button
                  onClick={() => handleRedeem(scriptKey)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-5 rounded-md"
                >
                  Redeem Key
                </button>
              </div>
            )}
          </div>
        )}

        {activePage === "Get Script" && (
          <div className="w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-6 text-gray-300">Get Script</h2>
            {scriptKey ? (
              <>
                <p className="text-gray-400 mb-4">Your Script Key:</p>
                <div
                  className="w-full px-4 py-3 border border-gray-600 rounded-md bg-gray-700 text-white overflow-auto break-all"
                  style={{ wordBreak: "break-word", minHeight: "50px" }} // เพิ่ม minHeight
                >
                  {scriptKey}
                </div>
                <button
                  onClick={handleShowModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-md my-5"
                >
                  Copy Script Key
                </button>
              </>
            ) : (
              <button
                onClick={handleGetScript}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-5 rounded-md"
              >
                Get Script
              </button>
            )}
          </div>
        )}

        {activePage === "Reset HWID" && (
          <div className="w-full max-w-md text-center">
            <h2 className="text-xl font-bold mb-6 text-gray-300">Reset HWID</h2>
            {error && <p className="text-red-500 mb-6">{error}</p>}
            <p className="text-gray-400 mb-4">Are you sure you want to reset your HWID?</p>
            <button
              onClick={handleResetHwid}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-md"
            >
              Reset HWID
            </button>
          </div>
        )}

      </div>

      {/* Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-md rounded-lg p-8 text-center relative">
            <button
              onClick={() => setShowRedeemModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✖
            </button>
            <div className="mb-6">
              <img
                src="https://media1.tenor.com/m/BSY1qTH8g-oAAAAd/check.gif"
                alt="Success Icon"
                className="mx-auto w-16 h-16"
              />
            </div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Redeem Key</h2>
            <p className="text-lg text-gray-500 mb-6">Redeem Completed Successfully!</p>
            <button
              onClick={() => setShowRedeemModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-lg rounded-lg p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-800">Your Script</h2>
            <div
              className="bg-gray-100 p-6 rounded-md mb-6 text-left overflow-auto"
              style={{
                maxHeight: "200px",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                border: "1px solid #ccc",
              }}
            >
              <code className="block whitespace-pre-wrap text-gray-800">
                {`
_G.Key = '${scriptKey}'
loadstring(game:HttpGet('https://raw.githubusercontent.com/rayrei0112/zetahub_loard/main/zetahub.lua'))();
                `}
              </code>
            </div>

            <button
              onClick={handleCopyCode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-md"
            >
              Copy Code
            </button>
          </div>
        </div>
      )}

      {/* Reset HWID Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-md rounded-lg p-8 text-center relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✖
            </button>
            <div className="mb-6">
              <img
                src="https://media1.tenor.com/m/BSY1qTH8g-oAAAAd/check.gif"
                alt="Success Icon"
                className="mx-auto w-16 h-16"
              />
            </div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Reset HWID</h2>
            <p className="text-lg text-gray-500 mb-6">Reset HWID Completed Successfully!</p>
            <button
              onClick={() => setShowResetModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default NavScript;

