import Link from "next/link";
import { useState } from "react";
import { FaHome, FaPlus, FaList, FaUser, FaCog } from "react-icons/fa";

const NavAdmin = () => {
  const [isExpanded, setIsExpanded] = useState(true); 

  return (
    <aside
      className={`${
        isExpanded ? "w-64" : "w-20"
      } bg-gray-800 text-white min-h-screen transition-all duration-300`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="text-xl font-bold">LOGO</div>
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          ☰
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <FaUser />
        </div>
        {isExpanded && (
          <div>
            <p className="font-semibold">Martha Owen</p>
            <p className="text-sm text-gray-400">Admin</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <FaHome />
              {isExpanded && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/add-item"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <FaPlus />
              {isExpanded && <span>Add Item</span>}
            </Link>
          </li>
          {/* <li>
            <Link
              href="/admin/manage-item"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <FaPlus />
              {isExpanded && <span>Manage Item</span>}
            </Link>
          </li> */}
          <li>
            <Link
              href="/admin/add-category"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <FaList />
              {isExpanded && <span>Categories</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/add-features"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <i className="far fa-info"></i>
              {isExpanded && <span>Features</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/add-news"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <i className="fal fa-newspaper"></i>
              {isExpanded && <span>News</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/setting-status"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <i className="fa-light fa-signal-bars"></i>
              {isExpanded && <span>Setting Status</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/add-faq"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <i className="fa-regular fa-question"></i>
              {isExpanded && <span>FAQ</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/history/buy"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <i className="fa-regular fa-clock-rotate-left"></i>
              {isExpanded && <span>History Buy</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/history/topup"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <i className="fa-regular fa-clock-rotate-left"></i>
              {isExpanded && <span>History Topup</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/Settings"
              className="flex items-center gap-4 p-3 hover:bg-gray-700 rounded-md"
            >
              <FaCog /> 
              {isExpanded && <span>Settings</span>}
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default NavAdmin;
