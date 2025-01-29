"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "./contexts/UserContext";
import Nav from "./components/Nav";
import Link from "next/link";
import { Badge } from "@radix-ui/themes";
import { toast } from "react-hot-toast";
import ItemModal from "./components/ItemModal";
import ToastContainer from "./components/ToastContainer";
import axios from "axios";
export default function HomePage() {
  // const searchParams = useSearchParams();
  // const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({});
  const [script, setScript] = useState([]);
  const [exploitor, setExploitor] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const alertTest = () => {
    toast.success("การแจ้งเตือนสำเร็จ!", {
      duration: 2000,
      position: "top-right",
    });
  };
  const handleShowDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };
  useEffect(() => {
    const fetchConfigSetting = async () => {
      try {
        const response = await axios.get(`/api/config`);
          console.log(response.data);
          setConfig(response.data);
      } catch (error) {
          console.error("Error fetching config settings:", error);
      } finally {
        setLoading(false);
      }
  };
    const fetchScript = async () => {
      try {
        const response = await fetch(`/api/status/script/data`);
        if (response.ok) {
          const data = await response.json();
          setScript(data.script);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        // setLoading(false);
      }
    };
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`/api/subscriptions`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSubscriptions(data.subscriptions);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        // setLoading(false);
      }
    };
    const fetchExploitor = async () => {
      try {
        const response = await fetch(`/api/status/exploitor/data`);
        if (response.ok) {
          const data = await response.json();
          setExploitor(data.exploitor);
        } else {
          console.error("Failed to fetch items");
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchConfigSetting();
    fetchExploitor();
    fetchScript();
    fetchSubscriptions();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-purple-400">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }
  // useEffect(() => {
  //   const username = searchParams.get("username");
  //   const avatar = searchParams.get("avatar");
  //   const nickname = searchParams.get("nickname");
  //   if (username && avatar && nickname) {
  //     setUser({ username, avatar, nickname });
  //   }
  // }, [searchParams, setUser]);
  return (
    <>
      <Nav />
      <div className="relative h-screen bg-cover bg-center flex overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover blur-md"
          autoPlay
          loop
          muted
        >
          <source
            src={config.video}
            type="video/mp4"
          />
        </video>
        <div className="absolute z-0 h-[150%] w-[100%] lg:translate-x-[50vw] lg:-translate-y-[5vh] lg:rotate-[10deg] bg-zinc-950/80 backdrop-blur-lg transition duration-500 ease-in-out"></div>
        <div className="absolute z-0 h-[150%] w-[100%] bg-zinc-950/80"></div>
        <div className="hidden lg:flex w-1/2 z-10">
          <div className="m-auto text-center -rotate-[5deg] animate__animated animate__faster animate__zoomIn hover:cursor-help">
            <h1 className="font-bold italic text-9xl tracking-tighter animate-bounce">
              Xzer
            </h1>
            <h1 className="font-bold italic text-8xl text-[#f1416d] tracking-tighter -mt-14 animate-bounce">
              Hub
            </h1>
          </div>
        </div>
        <div className="flex w-full lg:w-1/2 z-10">
          <div className="flex flex-col m-auto items-center w-full max-w-[400px] px-4 lg:px-0 lg:w-[25vw]">
            <div className="block lg:hidden text-center -rotate-[5deg] mb-12 hover:cursor-help">
              <h1 className="font-bold italic text-8xl sm:text-9xl tracking-tighter animate-bounce">
                Xzer
              </h1>
              <h1 className="font-bold italic text-7xl sm:text-8xl text-[#f1416d] tracking-tighter -mt-14 animate-bounce">
                Hub
              </h1>
            </div>
            <p className="text-center text-base sm:text-lg lg:text-base animate__animated animate__faster animate__fadeIn">
              {/* ใช้ dangerouslySetInnerHTML เพื่อแสดงผล HTML จาก description */}
              <span
                dangerouslySetInnerHTML={{
                  __html: config?.description.replace(/\n/g, "<br />"),
                }}
              />
            </p>
            <button
              className="font-bold py-2 px-6 mt-8 -skew-x-12 border transition ease-in-out duration-500 text-[#f1416d] border-[#f1416d] hover:-translate-y-1 hover:bg-[#f1416d] hover:text-white hover:shadow-lg hover:shadow-[#f1416d]"
              onClick={alertTest}
            >
              เลือกซื้อสินค้า
            </button>
          </div>
        </div>
      </div>
      <div
        className="py-32 px-4 space-y-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(22, 22, 34, 0), rgba(22, 22, 34, 0) 25%)",
        }}
      >
        <div className="z-10 container mx-auto border border-[#1f1f2e] px-6 sm:px-10 py-10">
          <div className="mx-auto -mt-16 py-2 px-6 bg-gradient-to-tr bg-[#f1416d] w-fit -skew-x-12 animate__animated animate__faster animate__zoomIn">
            <h1 className="text-xl sm:text-2xl">
              สถานะ <span className="font-bold">Script</span>
            </h1>
          </div>
          <div className="flex flex-col md:flex-row gap-10 mt-8">
            <div className="w-full">
              <h1 className="text-lg font-bold text-center sm:text-xl mb-4">
                <span className="text-[#f1416d]">Script</span> Status
              </h1>
              <ul>
                {script.map((item, index) => (
                  <li
                    className="p-2.5 border-t border-b  border-[#1f1f2e]"
                    key={index}
                  >
                    <p>
                      <span
                        className={`text-${item.status === "success"
                            ? "green-500"
                            : item.status === "error"
                              ? "red-500"
                              : "yellow-500"
                          }`}
                      >
                        <i className="fas fa-circle"></i>
                      </span>
                      &nbsp;&nbsp;{item.name}{" "}
                      <Badge
                        color={`${item.status === "success"
                            ? "green"
                            : item.status === "error"
                              ? "red"
                              : "yellow"
                          }`}
                      >
                        <span>{item.detail}</span>
                      </Badge>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <h1 className="text-lg font-bold text-center sm:text-xl mb-4">
                <span className="text-[#f1416d]">Exploitors</span> Supported
              </h1>
              <ul>
                {exploitor.map((item, index) => (
                  <li
                    className="p-2.5 border-t border-b  border-[#1f1f2e]"
                    key={index}
                  >
                    <p>{item.name}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="z-10 container mx-auto border border-[#1f1f2e] px-6 sm:px-10 py-10">
          <div className="mx-auto -mt-16 py-2 px-6 bg-gradient-to-tr bg-[#f1416d] w-fit -skew-x-12 animate__animated animate__faster animate__zoomIn">
            <h1 className="text-xl sm:text-2xl">
              สคริปต์ <span className="font-bold">Subscriptions</span>
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
            {subscriptions
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // เรียงลำดับล่าสุดมาก่อน
              .slice(0, 8)
              .map((item, index) => (
                <a
                type="button"
                onClick={() => handleShowDetails(item)}
                className="rounded-md shadow-lg overflow-hidden flex flex-col"
                key={item.id || index} // Use a unique value like item.id or fallback to index
              >
                <img
                  src={item.image}
                  alt="XzerHub"
                  className={`w-full h-full object-cover ${
                    item.datas && item.datas.length > 0 ? "grayscale-0" : "grayscale"
                  }`}
                />
                  <div className="flex justify-between items-center text-white text-lg pt-3">
                    <span className="font-semibold">{item.title}</span>
                    <span className="text-gray-300">{item.price} เครดิต</span>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>
      {showModal && selectedItem && (
        <ItemModal item={selectedItem} showModal={showModal} setShowModal={setShowModal} />
      )}
      <ToastContainer />
    </>
  );
  // return (
  //   <div>
  //     <Nav />
  //     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
  //       {user ? (
  //         <>
  //           <img
  //             src={user.avatar}
  //             alt={`${user.nickname}'s avatar`} // ใช้ nickname ใน alt
  //             className="w-20 h-20 rounded-full"
  //           />
  //           <h1 className="text-3xl font-bold mt-4">Welcome, {user.nickname}!</h1> {/* ใช้ nickname */}
  //         </>
  //       ) : (
  //         <h1 className="text-3xl font-bold">Welcome, Guest!</h1>
  //       )
  //       }
  //     </div>
  //   </div>
  // );
}
