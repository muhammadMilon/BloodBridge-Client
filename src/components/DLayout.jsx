import { useState } from "react";
import { Link } from "react-router";
import {
  FaHome,
  FaSearch,
  FaUser,
  FaBlog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const DLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Search Donor", path: "/dashboard/search", icon: <FaSearch /> },
    { name: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
    { name: "Blog", path: "/dashboard/blog", icon: <FaBlog /> },
  ];

  return (
    <>
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded-lg shadow-md focus:outline-none"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-red-600 to-rose-600 text-white w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-red-500">
          <span className="text-xl font-bold">BloodBridge</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col mt-6 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-3 px-6 py-3 hover:bg-red-500 transition-all duration-200"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default DLayout;
