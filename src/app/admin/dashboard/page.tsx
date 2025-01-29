"use client";

import React, { useEffect, useState, useRef, PureComponent } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "../../contexts/UserContext";
import NavAdmin from "../../components/NavAdmin";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
  YAxis,
  Legend,
} from "recharts";
import StatusItem from "@/app/components/StatusitemCount";
const data = [
  { name: "วันนี้", uv: 400, description: "ยอดขายรายวัน" },
  { name: "อาทิตย์นี้", uv: 300, description: "ยอดขายอาทิตย์นี้" },
  { name: "เดือนนี้", uv: 200, description: "ยอดขายเดือนนี้" },
  { name: "ปีนี้", uv: 200, description: "ยอดขายปีนี้" },
];

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [other, setOther] = useState([]);
  const { user, setUser } = useUser();
  const [productSell, setProductSell] = useState([]);
  const [productSellAll, setProductSellAll] = useState(0);
  const [bank, setBank] = useState([]);
  const [bankAll, setBankAll] = useState([]);

  const isChecking = useRef(false); // ใช้ useRef เป็น flag
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/getinfo");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProductSellAll(data.productSellAll);
          setProductSell(data.productSell);
          setBank(data.bank);
          setBankAll(data.AllTopup);
          setOther(data)
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
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
  const topupDay = bank[0] ? { ...bank[0], total: (bank[0].bank || 0) + (bank[0].wallet || 0),}: null; // กรณีที่ bank[0] ไม่มีค่า
  const topupWeek = bank[1] ? { ...bank[1], total: (bank[1].bank || 0) + (bank[1].wallet || 0),}: null; // กรณีที่ bank[0] ไม่มีค่า
  const topupMo = bank[1] ? { ...bank[2], total: (bank[2].bank || 0) + (bank[2].wallet || 0),}: null; // กรณีที่ bank[0] ไม่มีค่า

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-purple-400">
            กำลังโหลดข้อมูล...
          </p>
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
        <section className="space-y-3">
          <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-3 pt-3">
            <StatusItem title="ผู้ใช้ทั้งหมด" count={other?.userAll} icon="far fa-users" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3 pt-3">
            <StatusItem title="ไอเท็มในระบบ" count={other?.itemAll} icon="fas fa-swords" />
            <StatusItem title="สต็อกไอเท็มในระบบ" count={other?.stockAll} icon="fas fa-archive" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
            <StatusItem title="ยอดขายเงินวันนี้" count={productSell[0]?.count} icon="fas fa-check" />
            <StatusItem title="ยอดขายเงินอาทิตย์นี้" count={productSell[1]?.count} icon="fas fa-check" />
            <StatusItem title="ยอดขายเงินเดือนนี้" count={productSell[2]?.count} icon="fas fa-check" />
            <StatusItem title="ยอดขายเงินทั้งหมด" count={productSellAll} icon="fas fa-check" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
            <StatusItem title="ยอดเติมเงินวันนี้" count={topupDay?.total || 0} icon="far fa-coins" />
            <StatusItem title="ยอดเติมเงินอาทิตย์นี้" count={topupWeek?.total || 0} icon="far fa-coins" />
            <StatusItem title="ยอดเติมเงินเดือนนี้" count={topupMo?.total || 0} icon="far fa-coins" />
            <StatusItem title="ยอดเติมเงินทั้งหมด" count={bankAll} icon="far fa-coins" />
          </div>
        </section>
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">ยอดขายรวม</h2>
            <p className="mt-2 text-2xl font-bold">{productSellAll}ชิ้น</p>
            <ResponsiveContainer width="100%" height={300} className="mt-5">
              <BarChart data={productSell}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#e4159f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">ยอดเติมเงินรวม</h2>
            <p className="mt-2 text-2xl font-bold">฿{bankAll}</p>
            <ResponsiveContainer width="100%" height={300} className="mt-5">
              <BarChart data={bank}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="wallet" fill="#82ca9d" />
                <Bar dataKey="bank" fill="#e4159f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Sales Trends</h2>
            <Chart />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Store Visitors</h2>
            <Chart />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
