"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "../contexts/UserContext";
import Chart from "../components/Chart";
import PieChart from "../components/PieChart";
import NavAdmin from "../components/NavAdmin";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { user, setUser } = useUser();
  const isChecking = useRef(false); // ใช้ useRef เป็น flag

  useEffect(() => {
    const checkUserRole = async () => {
      if (user?.role) {
        setIsAdmin(user.role === "Admin");
        setLoading(false);
        return;
      }

      try {
        const discordId = user.username.replace("dc_", "");

        const response = await fetch("/api/admin/check-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ discordId }),
        });

        if (response.status === 200) {
          const data = await response.json();
          const updatedUser = { ...user, role: data.user.role };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkUserRole();
    }
  }, [user, setUser]);

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

  if (!isAdmin) {
    return <p>Access denied. Admins only.</p>; // แสดงข้อความปฏิเสธการเข้าถึง
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <NavAdmin />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome, {user?.nickname || user?.username}!</p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">ยอดขายรวม</h2>
            <p className="mt-2 text-2xl font-bold">฿150,200.00</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Store Visitors</h2>
            <p className="mt-2 text-2xl font-bold">297,506</p>
            <p>Bounce Rate: 35.07%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Sessions by Channel</h2>
            <PieChart />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Sales Trends</h2>
            <Chart />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Store Visitors</h2>
            <Chart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
