"use client";

import { useState, useEffect } from "react";
import NavAdmin from "../../components/NavAdmin";
import ToastContainer from "@/app/components/ToastContainer";
import { toast } from "react-hot-toast";
import { Button, Flex, Table } from "@radix-ui/themes";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import dynamic  from "next/dynamic";
import axios from "axios";
const AddFAQPage = () => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const [detail, setDetail] = useState("");
    // Exploitor Status
    const [nameExploitor, setNameExploitor] = useState("");
    const [data, setData] = useState([]);
    const [dataExploitor, setDataExploitor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isModalOpenExploitor, setIsModalOpenExploitor] = useState(false);
    const [editDataExploitor, setEditDataExploitor] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/admin/scriptstatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    status: status,
                    detail: detail,
                }),
            });

            if (response.ok) {
                toast.success("สำเร็จ!", {
                    duration: 2000,
                    position: "top-right",
                });
                setName("");
                setStatus("");
                setDetail("");
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.error("Error response from server:", errorData);
                toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`, {
                    duration: 2000,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Error submitting category:", error);
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", {
                duration: 2000,
                position: "top-right",
            });
        }
    };
    const ExploitorSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/admin/exploitorstatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: nameExploitor,
                }),
            });

            if (response.ok) {
                toast.success("สำเร็จ!", {
                    duration: 2000,
                    position: "top-right",
                });
                setName("");
                setStatus("");
                setDetail("");
                window.location.reload();
            } else {
                const errorData = await response.json();
                console.error("Error response from server:", errorData);
                toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`, {
                    duration: 2000,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Error submitting category:", error);
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์", {
                duration: 2000,
                position: "top-right",
            });
        }
    };
    useEffect(() => {
        const fetchDataAPI = async () => {
            try {
                const response = await axios.get("/api/admin/scriptstatus");
                console.log(response.data);

                // ตรวจสอบว่า DataFeatures มีข้อมูลหรือไม่
                if (response.data) {
                    const data = response.data.DataTarget;
                    setData(response.data.DataTarget);
                    setName(data.name)
                    setDetail(data.detail)
                } else {
                    console.error("No features found in the response");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchDataAPIExploitor = async () => {
            try {
                const response = await axios.get("/api/admin/exploitorstatus");
                console.log(response.data);
                if (response.data) {
                    setDataExploitor(response.data.DataTarget);
                } else {
                    console.error("No features found in the response");
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataAPIExploitor();
        fetchDataAPI();
    }, []);
    const handleOpenModalExploitor = (data) => {
        setNameExploitor(data.name)
        setEditDataExploitor(data); // เซ็ตข้อมูลหมวดหมู่ที่ต้องการแก้ไข
        setIsModalOpenExploitor(true); // เปิด Modal
    };
    const handleCloseModalExploitor = () => {
        setEditDataExploitor(null);
        setIsModalOpenExploitor(false);
    };

    const handleOpenModal = (data) => {
        setEditData(data); // เซ็ตข้อมูลหมวดหมู่ที่ต้องการแก้ไข
        setName(data.name)
        setStatus(data.status)
        setDetail(data.detail)
        setIsModalOpen(true); // เปิด Modal
    };

    const handleCloseModal = () => {
        setEditData(null); // ล้างข้อมูล
        setIsModalOpen(false); // ปิด Modal
    };
    const handleEditCategory = async (e) => {
        e.preventDefault();

        const data = {
            name: name,
            status: status,
            detail: detail,
        };

        try {
            const response = await fetch(
                `/api/admin/scriptstatus?id=${editData._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json", // กำหนด Content-Type เป็น application/json
                    },
                    body: JSON.stringify(data), // ส่งข้อมูลในรูปแบบ JSON
                }
            );

            if (response.ok) {
                toast.success("แก้ไขหมวดหมู่สำเร็จ!");
                const updatedData = await response.json();
                setData((prev) =>
                    prev.map((data) => (data.id === updatedData.id ? updatedData : data))
                );
                window.location.reload();
                handleCloseModal(); // ปิด Modal หลังจากแก้ไขสำเร็จ
            } else {
                const errorData = await response.json();
                toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`);
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    };
    const handleDeleteCategory = async (id) => {
        try {
            const response = await fetch(`/api/admin/scriptstatus?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("ลบหมวดหมู่สำเร็จ!", {
                    duration: 2000,
                    position: "top-right",
                });
                setData((prevData) => prevData.filter((data) => data._id !== id));
                window.location.reload();
            } else {
                toast.error("ไม่สามารถลบหมวดหมู่ได้", {
                    duration: 2000,
                    position: "top-right",
                });
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("เกิดข้อผิดพลาดในการลบหมวดหมู่", {
                duration: 2000,
                position: "top-right",
            });
        }
    };
    const handleDeleteCategoryExploitor = async (id) => {
        try {
          const response = await fetch(`/api/admin/exploitorstatus?id=${id}`, {
            method: "DELETE",
          });
    
          if (response.ok) {
            toast.success("ลบหมวดหมู่สำเร็จ!", {
              duration: 2000,
              position: "top-right",
            });
            setDataExploitor((prevData) => prevData.filter((data) => data._id !== id));
            window.location.reload();
          } else {
            toast.error("ไม่สามารถลบหมวดหมู่ได้", {
              duration: 2000,
              position: "top-right",
            });
          }
        } catch (error) {
          console.error("Error deleting category:", error);
          toast.error("เกิดข้อผิดพลาดในการลบหมวดหมู่", {
            duration: 2000,
            position: "top-right",
          });
        }
      };
    const handleEditCategoryExploitor = async (e) => {
        e.preventDefault();
        const data = {
            name: nameExploitor
        };

        try {
            const response = await fetch(
                `/api/admin/exploitorstatus?id=${editDataExploitor._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json", // กำหนด Content-Type เป็น application/json
                    },
                    body: JSON.stringify(data), // ส่งข้อมูลในรูปแบบ JSON
                }
            );

            if (response.ok) {
                toast.success("แก้ไขหมวดหมู่สำเร็จ!");
                const updatedData = await response.json();
                setDataExploitor((prev) =>
                    prev.map((data) => (data.id === updatedData.id ? updatedData : data))
                );
                handleCloseModalExploitor(); // ปิด Modal หลังจากแก้ไขสำเร็จ
                window.location.reload();
            } else {
                const errorData = await response.json();
                toast.error(`เกิดข้อผิดพลาด: ${errorData.message}`);
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
    }
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
    if (data.length === 0) {
        return <p className="text-center text-white">ไม่มีหมวดหมู่ในขณะนี้</p>;
    }
    return (
        <div className="min-h-screen grid grid-cols-[auto,1fr] bg-gray-800 text-white">
            {/* Sidebar */}
            <NavAdmin />
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">Setting Status</h1>
                <div className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-3xl font-bold mb-4">Script Status</h1>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Script Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Blox Fruit"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Type *</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 p-2 border border-gray-700 bg-gray-900 rounded-md w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                <option value="">สถานะ</option>
                                <option value="success">success</option>
                                <option value="error">danger</option>
                                <option value="warning">warning</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                รายละเอียด *
                            </label>
                            <input
                                type="text"
                                value={detail}
                                onChange={(e) => setDetail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Closer"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
                        >
                            เพิ่ม
                        </button>
                    </form>
                    <div className="mt-5">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>ชื่อเกม</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>สถานะ</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>เพิ่มเติม</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>แก้ไข</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>ลบ</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {data.map((data, key) => (
                                    <Table.Row key={key}>
                                        <Table.RowHeaderCell>{data.name}</Table.RowHeaderCell>
                                        <Table.Cell>{data.status}</Table.Cell>
                                        <Table.Cell>{data.detail}</Table.Cell>
                                        <Table.Cell>
                                            <button
                                                onClick={() => handleOpenModal(data)}
                                                className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-md mt-2"
                                            >
                                                แก้ไข
                                            </button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <button
                                                onClick={() => handleDeleteCategory(data._id)}
                                                className="bg-red-500/10 text-red-400 px-4 py-2 rounded-md mt-2"
                                            >
                                                ลบ
                                            </button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </div>
                </div>

                <div className="bg-gray-800 p-10 rounded-lg shadow-lg border border-gray-700 pt-10 mt-10">
                    <form onSubmit={ExploitorSubmit}>
                        <h1 className="text-3xl font-bold mb-4">Exploitor Status</h1>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Exploitor Name *
                            </label>
                            <input
                                type="text"
                                value={nameExploitor}
                                onChange={(e) => setNameExploitor(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Synapse Z"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
                        >
                            เพิ่ม
                        </button>
                    </form>
                    <div className="mt-5">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>ชื่อตัวรัน</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>แก้ไข</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>ลบ</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {dataExploitor.map((data, key) => (
                                    <Table.Row key={key}>
                                        <Table.RowHeaderCell>{data.name}</Table.RowHeaderCell>
                                        <Table.Cell>
                                            <button
                                                onClick={() => handleOpenModalExploitor(data)}
                                                className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-md mt-2"
                                            >
                                                แก้ไข
                                            </button>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <button
                                                onClick={() => handleDeleteCategoryExploitor(data._id)}
                                                className="bg-red-500/10 text-red-400 px-4 py-2 rounded-md mt-2"
                                            >
                                                ลบ
                                            </button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && (
                <AlertDialog.Root open={isModalOpen} onOpenChange={handleCloseModal}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
                    <AlertDialog.Content className="bg-white rounded-md shadow-md p-4 fixed inset-1/4">
                        <AlertDialog.Title className="font-bold text-lg">แก้ไข</AlertDialog.Title>
                        <AlertDialog.Description>
                            <form onSubmit={handleEditCategory}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">ชื่อเกม *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Type *</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    >
                                        <option value="">สถานะ</option>
                                        <option value="success">success</option>
                                        <option value="error">danger</option>
                                        <option value="warning">warning</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">รายละเอียด *</label>
                                    <input
                                        type="text"
                                        value={detail}
                                        onChange={(e) => setDetail(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <Flex justify="end" mt="4">
                                    <AlertDialog.Cancel asChild>
                                        <Button variant="soft" color="gray">
                                            ยกเลิก
                                        </Button>
                                    </AlertDialog.Cancel>
                                    <Button type="submit" variant="surface" color="blue">
                                        บันทึกการแก้ไข
                                    </Button>
                                </Flex>
                            </form>
                        </AlertDialog.Description>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
            )}
            {isModalOpenExploitor && (
                <AlertDialog.Root
                    open={isModalOpenExploitor}
                    onOpenChange={handleCloseModalExploitor}
                >
                    <AlertDialog.Content>
                        <AlertDialog.Description>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    ชื่อตัวรัน
                                </label>
                                <input
                                    type="text"
                                    value={nameExploitor}
                                    onChange={(e) => setNameExploitor(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder={editDataExploitor?.name}
                                    required
                                />
                            </div>
                        </AlertDialog.Description>
                        <Flex justify="end" mt="4">
                            <Button variant="soft" color="gray" onClick={handleCloseModalExploitor}>
                                <span>ยกเลิก</span>
                            </Button>
                            <Button
                                variant="surface"
                                color="blue"
                                onClick={handleEditCategoryExploitor}
                            >
                                <span>บันทึกการแก้ไข</span>
                            </Button>
                        </Flex>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            )}
            <ToastContainer />
        </div>
    );
};

export default AddFAQPage;
