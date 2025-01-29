"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../contexts/UserContext";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Nav: React.FC = () => {
  const Menu = [
    { name: "Home", icon: "far fa-home", link: "/" },
    { name: "Features", icon: "far fa-shield-alt", link: "/features" },
    { name: "Store", icon: "fal fa-shopping-basket", link: "/store" },
    { name: "Topup", icon: "far fa-money-check-alt", link: "/topup" },
    { name: "News", icon: "fa-sharp fa-thin fa-newspaper", link: "/news" },
    { name: "FAQ", icon: "fal fa-question", link: "/faq" },
  ];

  const { user, setUser } = useUser();
  const [credits, setCredits] = useState<number>(0);
  const [rewards, setRewards] = useState<number>(0);
  const [role, setRole] = useState<string>("User");
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [config, setConfig] = useState({});

  // Inbox Zone
  const [inbox, setInbox] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /** ฟังก์ชันเปลี่ยนหน้า */
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  /** ฟิลเตอร์ (กรณีต้องการ) */
  const filteredData = inbox
    .filter((item) => item.title?.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // เพิ่มการเรียงลำดับตาม createdAt

    const paginatedData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const countFalseClicks = inbox.filter((item) => item.click === false).length;

  /** ฟังก์ชัน fallback image */
  const getImageUrl = (imagePath: string | null): string => {
    console.log("Original Image Path:", imagePath);
    
    if (!imagePath) return "/uploads/default-placeholder.png";
    
    // Remove any leading/trailing slashes and clean up the path
    const cleanPath = imagePath.replace(/^\/+|\/+$/g, '');
    
    // If it's already a full URL, return it as is
    if (cleanPath.startsWith('http')) {
      return cleanPath;
    }
    
    // Remove any duplicate 'uploads' in the path
    const normalizedPath = cleanPath.replace(/uploads\/+uploads/g, 'uploads');
    
    // If path already starts with 'uploads', remove it to prevent duplication
    const finalPath = normalizedPath.startsWith('uploads/') 
      ? normalizedPath.replace('uploads/', '')
      : normalizedPath;
      
    // Construct the final URL
    const baseUrl = 'http://localhost:3000/uploads/';
    const result = `${baseUrl}${finalPath}`;
    
    console.log("Final Image URL:", result);
    return result;
  };
  
    useEffect(() => {
    if (user) {
      fetch("/api/user/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discordId: user.username }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCredits(data.credits || 0);
          setRewards(data.rewards || 0);
          setRole(data.role || "User"); // ตั้งค่า role จาก API
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [user]);
  

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // 1) ดึง config
  useEffect(() => {
    const fetchConfigSetting = async () => {
      try {
        const response = await axios.get(`/api/config`);
        setConfig(response.data);
      } catch (error) {
        console.error("Error fetching config settings:", error);
      }
    };
    fetchConfigSetting();
  }, []);

  // 2) รับ user จาก query params
  useEffect(() => {
    const id = searchParams.get("id");
    const username = searchParams.get("username");
    const avatar = searchParams.get("avatar");
    const nickname = searchParams.get("nickname");
    if (id && username && avatar && nickname) {
      const userData = { username, nickname, avatar };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  }, [searchParams, setUser]);

  const extractTitleFromDescription = (description: string): string | null => {
    const match = description.match(/ซื้อ\s(.+?)\sสำเร็จ/); // ปรับให้จับเฉพาะคำสำเร็จ
    return match ? match[1].trim() : null;
  };
  

  // 3) ดึงข้อมูล Items + Inbox และ merge
  // ใน useEffect หรือที่คุณ merge inboxData กับ itemsData
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // ดึงข้อมูล Items Data จาก /api/admin/items
        const itemsRes = await axios.get("/api/admin/items");
        const itemsData = itemsRes.data?.items || [];

        // ดึงข้อมูล Message Data จาก /api/inbox
        const inboxRes = await axios.post("/api/inbox", {
          daataid: user.username,
        });
        const inboxData = inboxRes.data?.Msgdata || [];

        // รวมข้อมูลโดยการ match
       // Debug ในฟังก์ชัน map() ของ mergedData
       const mergedData = inboxData.map((msg) => {
        const extractedTitle = extractTitleFromDescription(msg.description);
        const matchedItem = itemsData.find(
          (item) => item.title.toLowerCase() === extractedTitle.toLowerCase()
        );
      
        // Debug
        console.log("Message Description:", msg.description);
        console.log("Extracted Title:", extractedTitle);
        console.log("Matched Item:", matchedItem);
      
        // เพิ่ม image หรือ fallback
        const updatedMsg = matchedItem
          ? { ...msg, image: getImageUrl(matchedItem.image) }
          : { ...msg, image: "/uploads/default-placeholder.png" }; // fallback image
        
        console.log("Updated Message:", updatedMsg); // Debug Updated Message
      
        return updatedMsg;
      });
      


        console.log("Merged Data:", mergedData); // Debug merged data
        setInbox(mergedData);
      } catch (error) {
        console.error("Error merging data:", error);
      }
    };

    fetchData();
  }, [user]);
  
  
  

  /** เมื่อกดแจ้งเตือน (อ่าน) */
  const clickInbox = async (path: string, id: string) => {
    const response = await axios.get(`/api/inbox?id=${id}`);
    if (response.data.status === true) {
      router.push(path);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push(`/login`);
  };

  const avatar = user?.avatar || "/default-avatar.png";
  const displayName = user?.nickname || user?.username || "Unknown User";

  return (
    <>
      <header className="flex tracking-wide relative z-50">
        <div className="flex backdrop-blur-md bg-black/50 fixed w-full top-0 left-0 items-center justify-between sm:px-10 px-4 py-3 gap-4  mx-auto">
          {/* Left Section: Logo and Collapse Menu */}
          <div className="flex items-center gap-4">
            <Link href="/" className="max-sm:hidden">
              <img src={config?.logo} alt="logo" className="w-[75px]" />
            </Link>
            <Link href="/" className="hidden max-sm:block">
              <img src={config?.logo} alt="logo" className="w-[px]" />
            </Link>

            <div
              id="collapseMenu"
              style={{ display: showModal ? "block" : "none" }}
              className={`max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50`}
            >
              <button
                id="toggleClose"
                className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border"
                onClick={closeModal}
              >
                {/* icon X */}
              </button>

              <ul className="lg:flex lg:gap-x-10 max-lg:space-y-3 max-lg:fixed max-lg:bg-white/5 max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                {/* เมนูต่างๆ */}
                {Menu.map((item, index) => (
                  <li className="max-lg:border-b max-lg:py-3" key={index}>
                    <Link
                      href={item.link}
                      className="text-white/40 font-bold transition duration-500 ease-in-out hover:cursor-pointer hover:text-white text-[15px] text-blue-600 block"
                    >
                      <i className={item.icon}></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section: Profile and Icons */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* Profile Dropdown */}
                <span className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <img
                        src={avatar}
                        alt="profile"
                        className="relative bg-white/10 w-12 h-12 flex items-center justify-center text-white font-bold rounded-full"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>
                        <span className="font-bold">{displayName}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <span>
                            <i className="fal fa-coins"></i> Credits: {credits.toFixed(2)} ฿
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span>
                            <i className="fal fa-trophy-alt"></i> Rewards: {rewards.toFixed(2)} ฿
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <span>
                              <i className="far fa-history"></i> History
                            </span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>
                                <Link href="/history/buy">Buy</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href="/history/topup">Top-up</Link>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        {role === "Admin" && (
                          <DropdownMenuItem>
                            <Link href="/admin/dashboard">
                              <i className="fas fa-wrench"></i> Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Button
                          onClick={handleLogout}
                          variant="secondary"
                          className="w-full bg-red-600/85 hover:bg-red-600/70 text-white border-red-600"
                        >
                          <i className="fal fa-sign-out-alt"></i>
                          Log out
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>

                {/* Notification / Inbox */}
                <span className="relative bg-white/10 w-12 h-12 flex items-center justify-center text-white font-bold rounded-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <a type="button" href="#" className="b-none">
                        <i className="fa-regular fa-bell p-3 cursor-pointer fill-[#333] hover:fill-[#007bff] inline"></i>
                        <span className="absolute left-auto -ml-1 -top-2 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                          {countFalseClicks}
                        </span>
                      </a>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-[400px] p-0 border-0">
                      <div className="overflow-hidden rounded-lg bg-gray-900 shadow-lg border border-gray-800">
                        <div className="p-4 bg-gray-800/50">
                          <h3 className="text-lg font-medium text-white flex items-center">
                            <i className="far fa-bell mr-2"></i>
                            การแจ้งเตือน
                          </h3>
                        </div>

                        <div className="divide-y divide-gray-700/30 max-h-[400px] overflow-y-auto">
                          {paginatedData.map((data, key) => (
                            <div 
                              key={key}
                              onClick={() => clickInbox(data?.link, data?._id)}
                              className="flex items-start space-x-4 p-4 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer border-b border-gray-700/30"
                            >
                              <div className="flex-shrink-0">
                                <img
                                  src={data?.image || "/uploads/default-placeholder.png"}
                                  alt={data?.title || "Notification"}
                                  className="w-12 h-12 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/uploads/default-placeholder.png";
                                  }}
                                />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <p className="text-sm font-medium text-white truncate">
                                    {data?.title || "สั่งซื้อสินค้าสำเร็จ!"}
                                  </p>
                                  {!data?.click && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                      New
                                    </span>
                                  )}
                                </div>
                                
                                <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                                  {data?.description || "No description available"}
                                </p>
                                
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <i className="far fa-clock mr-1.5"></i>
                                  <time dateTime={data?.createdAt}>
                                    {new Date(data?.createdAt).toLocaleString('th-TH', {
                                      year: 'numeric',
                                      month: 'numeric',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </time>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-gray-800/50 flex items-center justify-between">
                          <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="far fa-chevron-left mr-1"></i>
                            ก่อนหน้า
                          </button>
                          <button 
                            onClick={() => router.push("/history/buy")}
                            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            ดูทั้งหมด
                          </button>
                          <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ถัดไป
                            <i className="far fa-chevron-right ml-1"></i>
                          </button>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>

                {/* Link อื่น ๆ */}
                <Link
                  href="/script"
                  className="relative bg-white/10 w-12 h-12 flex items-center justify-center text-white font-bold rounded-full"
                >
                  <i className="far fa-scroll p-3 cursor-pointer fill-[#333] hover:fill-[#007bff] inline"></i>
                </Link>
                <button
                  id="toggleOpen"
                  className="lg:hidden bg-white/10 rounded"
                  onClick={openModal}
                >
                  <i className="fa-regular fa-bars p-3"></i>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white/40 font-bold transition duration-500 ease-in-out hover:cursor-pointer hover:text-white"
                >
                  <i className="fab fa-discord"></i> Login
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Nav;



// "use client";
// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { useUser } from "../contexts/UserContext";
// import { useSearchParams, useRouter } from "next/navigation";
// import Image from "next/image";
// const Nav: React.FC = () => {
//   const { user, setUser } = useUser();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfile, setIsProfile] = useState(false);
//   const [credits, setCredits] = useState<number>(0);
//   const [rewards, setRewards] = useState<number>(0);
//   const [role, setRole] = useState<string>("User"); // เพิ่ม state rol
//   const router = useRouter();
//   const menuRef = useRef<HTMLDivElement>(null);
//   const searchParams = useSearchParams();
//   const Menu = [
//     {
//       name: "Home",
//       icon: "far fa-home",
//       link: "/",
//     },
//     {
//       name: "Features",
//       icon: "far fa-shield-alt",
//       link: "/features",
//     },
//     {
//       name: "Store",
//       icon: "fal fa-shopping-basket",
//       link: "/store",
//     },
//     {
//       name: "Topup",
//       icon: "far fa-money-check-alt",
//       link: "/topup",
//     },
//     {
//       name: "Script",
//       icon: "far fa-scroll",
//       link: "/script",
//     },
//     {
//       name: "News",
//       icon: "fa-sharp fa-thin fa-newspaper",
//       link: "/news",
//     },
//     {
//       name: "FAQ",
//       icon: "fal fa-question",
//       link: "/faq",
//     },
//   ];
//   useEffect(() => {
//     const id = searchParams.get("id");
//     const username = searchParams.get("username");
//     const avatar = searchParams.get("avatar");
//     const nickname = searchParams.get("nickname");

//     if (id && username && avatar && nickname) {
//       const userData = { username, nickname, avatar };
//       localStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);
//     }
//   }, [searchParams, setUser]);

//   useEffect(() => {
//     if (user) {
//       fetch("/api/user/check", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ discordId: user.username }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           setCredits(data.credits || 0);
//           setRewards(data.rewards || 0);
//           setRole(data.role || "User"); // ตั้งค่า role จาก API
//         })
//         .catch((error) => console.error("Error fetching user data:", error));
//     }
//   }, [user]);

//   const toggleMenu = () => setIsMenuOpen((prev) => !prev);
//   const toggleProfile = () => setIsProfile((prev) => !prev);

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     router.push(`/login`);
//   };

//   const avatar = user?.avatar || "/default-avatar.png";
//   const displayName = user?.nickname || user?.username || "Unknown User";

//   return (
//     <>
//       <nav className="fixed z-50 w-full px-4 py-2.5 bg-white/5 backdrop-blur-md">
//         <div className="container flex flex-col lg:flex-row items-center justify-between mx-auto">
//           <Link href="/" className="flex mr-0 sm:mr-8">
//             <img
//               className="min-w-12 h-12"
//               src="https://i.postimg.cc/Mp8FTdqL/1669310568096.png"
//               alt="logo_navbar"
//             />
//           </Link>
//           <button
//             onClick={toggleMenu}
//             type="button"
//             className="text-white lg:hidden absolute right-4 top-4 bg-white/10  p-1.5 transition duration-500 ease-in-out hover:bg-white/20 rounded"
//           >
//             <i className="fa-regular fa-bars p-2"></i>
//           </button>

//           <div
//             className={`${isMenuOpen ? "" : "hidden"
//               } lg:flex w-full flex-col lg:flex-row justify-between`}
//           >
//             <div>
//               <ul className="flex flex-col lg:flex-row space-x-0 lg:space-x-8 space-y-4 lg:space-y-0">
//                 {Menu.map((item, index) => (
//                   <li className="hover:cursor-pointer" key={index}>
//                     <Link
//                       href={item.link}
//                       className="text-white/40 font-bold transition duration-500 ease-in-out hover:cursor-pointer hover:text-white"
//                     >
//                       <i className={item.icon}></i> {item.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className="py-4 lg:py-0">
//               <ul className="flex flex-row space-x-8">
//                 <li className="relative" ref={menuRef}>
//                   {user ? (
//                     <button
//                       className="text-white/40 font-bold transition duration-500 ease-in-out hover:cursor-pointer hover:text-white"
//                       onClick={toggleProfile}
//                     >
//                       {displayName} <i className="fas fa-angle-down"></i>
//                       {/* <img
//                         src={avatar}
//                         alt={`${displayName}'s avatar`}
//                         className="w-[30px] rounded-full object-cover"
//                       /> */}
//                     </button>
//                   ) : (
//                     <>
//                       <Link
//                         href="/login"
//                         className="text-white/40 font-bold transition duration-500 ease-in-out hover:cursor-pointer hover:text-white"
//                       >
//                         <i className="fab fa-discord"></i> Login
//                       </Link>
//                     </>
//                   )}

//                   {isProfile && (
//                     <div className="absolute sm:left-0 lg:right-10 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg">
//                       <div className="px-4 py-2 border-b border-gray-700">
//                         <p>Credits: {credits.toFixed(2)} 💰</p>
//                         <p>Rewards: {rewards.toFixed(2)} 🏆</p>
//                       </div>
//                       <ul className="py-2">
//                         <li>
//                           <Link
//                             href="/profile"
//                             className="block px-4 py-2 hover:bg-gray-700"
//                           >
//                             Profile Settings
//                           </Link>
//                         </li>
//                         <li>
//                           <Link
//                             href="/history"
//                             className="block px-4 py-2 hover:bg-gray-700"
//                           >
//                             Your History
//                           </Link>
//                         </li>
//                         {role === "Admin" && (
//                           <li>
//                             <Link
//                               href="/admin"
//                               className="block px-4 py-2 hover:bg-gray-700"
//                             >
//                               Admin Dashboard
//                             </Link>
//                           </li>
//                         )}
//                         <li>
//                           <button
//                             onClick={handleLogout}
//                             className="block w-full text-left px-4 py-2 hover:bg-gray-700"
//                           >
//                             Logout
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   )}
//                 </li>
//                 <span className="relative">
//                   <i className="fa-regular fa-clock-rotate-left cursor-pointer text-white/40 font-bold hover:fill-[#007bff] inline"></i>
//                 </span>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Nav;
