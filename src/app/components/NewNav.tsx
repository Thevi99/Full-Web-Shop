"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../contexts/UserContext";
import { useSearchParams, useRouter } from "next/navigation";
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
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
const NewNav: React.FC = () => {
    const Menu = [
        {
            name: "Home",
            icon: "far fa-home",
            link: "/",
        },
        {
            name: "Features",
            icon: "far fa-shield-alt",
            link: "/features",
        },
        {
            name: "Store",
            icon: "fal fa-shopping-basket",
            link: "/store",
        },
        {
            name: "Topup",
            icon: "far fa-money-check-alt",
            link: "/topup",
        },
        {
            name: "Script",
            icon: "far fa-scroll",
            link: "/script",
        },
        {
            name: "News",
            icon: "fa-sharp fa-thin fa-newspaper",
            link: "/news",
        },
        {
            name: "FAQ",
            icon: "fal fa-question",
            link: "/faq",
        },
    ];
    const { user, setUser } = useUser();
    const [credits, setCredits] = useState<number>(0);
    const [rewards, setRewards] = useState<number>(0);
    const [role, setRole] = useState<string>("User"); // เพิ่ม state rol
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true)
    }
    const closeModal = () => {
        setShowModal(false)
    }
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
      const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        router.push(`/login`);
      };
    
      const avatar = user?.avatar || "/default-avatar.png";
      const displayName = user?.nickname || user?.username || "Unknown User";
    return (
        <>
            <header className="flex border-b bg-white/5 min-h-[70px] tracking-wide relative z-50">
                <div className="flex items-center justify-between sm:px-10 px-4 py-3 gap-4 w-full  mx-auto">
                    {/* Left Section: Logo and Collapse Menu */}
                    <div className="flex items-center gap-4">
                        <a href="javascript:void(0)" className="max-sm:hidden">
                            <img
                                src="https://readymadeui.com/readymadeui.svg"
                                alt="logo"
                                className="w-32"
                            />
                        </a>
                        <a href="javascript:void(0)" className="hidden max-sm:block">
                            <img
                                src="https://readymadeui.com/readymadeui-short.svg"
                                alt="logo"
                                className="w-9"
                            />
                        </a>

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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3.5 h-3.5 fill-black"
                                    viewBox="0 0 320.591 320.591"
                                >
                                    <path
                                        d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                        data-original="#000000"
                                    ></path>
                                    <path
                                        d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                        data-original="#000000"
                                    ></path>
                                </svg>
                            </button>

                            <ul className="backdrop-blur-md lg:flex lg:gap-x-10 max-lg:space-y-3 max-lg:fixed max-lg:bg-white/5 max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                                <li className="mb-6 hidden max-lg:block">
                                    {/* <a href="javascript:void(0)">
                                        <img
                                            src="https://readymadeui.com/readymadeui.svg"
                                            alt="logo"
                                            className="w-36"
                                        />
                                    </a> */}
                                </li>
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
                            <span className="relative">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <img
                                            src={avatar}
                                            alt="profile"
                                            className="rounded-full p-3 cursor-pointer w-[3.5rem] h-[3.5rem] fill-[#333] hover:fill-[#007bff] inline border-red-500"
                                        />

                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">

                                        <DropdownMenuLabel>
                                            <span className="font-bold">{displayName}</span>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <span><i className="fal fa-coins"></i> Credits: {credits.toFixed(2)} ฿</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <span><i className="fal fa-trophy-alt"></i> Rewards: {rewards.toFixed(2)} ฿</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <span><i className="fal fa-user"></i> Profile</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>
                                                    <span><i className="far fa-history"></i> History</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem>
                                                            <span>Buy</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <span>Top-up</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                        </DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Button onClick={handleLogout} variant="secondary" className="w-full bg-red-600/85 hover:bg-red-600/70 text-white border-red-600">
                                                <i className="fal fa-sign-out-alt"></i>
                                                Log out
                                            </Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </span>
                            <span className="relative bg-white/10 rounded-full">
                                <i className="fa-regular fa-messages p-3 cursor-pointer fill-[#333] hover:fill-[#007bff] inline"></i>
                            </span>
                            <span className="relative bg-white/10 rounded-full">
                                <i className="fa-regular fa-clock-rotate-left p-3 cursor-pointer fill-[#333] hover:fill-[#007bff] inline"></i>
                            </span>

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
                            <Link href="/login" className="text-white/40 font-bold transition duration-500 ease-in-out hover:cursor-pointer hover:text-white">
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

export default NewNav;
