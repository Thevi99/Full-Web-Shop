"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "../../components/Nav";
import ItemModal from "../../components/ItemModal";
import { useSearchParams } from 'next/navigation'

const CategoryPage = () => {
  const params = useParams();
  const { categoryId } = params;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/admin/items?categoryId=${categoryId}`);
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchItems();
    }
  }, [categoryId]);

  const handleShowDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowModal(false);
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

  if (items.length === 0) {
    return <p className="text-center text-white">ไม่มีสินค้าในหมวดหมู่นี้</p>;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #1e3a8a, #000000)",
        color: "white",
      }}
    >
      <Nav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
        <h1 className="text-4xl font-bold mb-8 text-center">สินค้าในหมวดหมู่</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white/10 backdrop-blur-md rounded-md shadow-lg overflow-hidden flex flex-col"
              style={{
                width: "100%",
                maxWidth: "320px",
                margin: "0 auto",
              }}
            >
              <div style={{ height: "290px", width: "100%" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
                />
              </div>
              <div className="p-4 text-center flex-grow">
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                <p className="text-purple-600 font-bold text-lg">฿{item.price}</p>
                <button
                  onClick={() => handleShowDetails(item)}
                  className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
                >
                  อ่านรายละเอียด
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedItem && (
        // <ItemModal item={selectedItem} onClose={handleCloseModal} />
        <ItemModal item={selectedItem} showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default CategoryPage;
