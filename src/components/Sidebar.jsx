// Sidebar.jsx
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import {
    FaBars,
    FaClipboardList,
    FaHome,
    FaPencilAlt,
    FaTimes,
    FaUsers,
} from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import { Link, NavLink } from "react-router";
import useRole from "../hooks/useRole";

const Sidebar = () => {
  const logoSrc = "/Logo.png";
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { role, loading } = useRole();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const getBasePath = () => {
    if (role === "admin") return "/admindashboard";
    if (role === "donor") return "/donordashboard";
    if (role === "receiver") return "/recipientdashboard";
    return "/dashboard";
  };

  const basePath = getBasePath();

  const adminMenu = [
    { name: "Dashboard", path: "/admindashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/admindashboard/profile", icon: <CgProfile /> },
    { name: "All Users", path: "/admindashboard/all-users", icon: <FaUsers /> },
    {
      name: "All Donation Request",
      path: "/admindashboard/all-blood-donation-request",
      icon: <FaClipboardList />,
    },
    {
      name: "Content Management",
      path: "/admindashboard/content-management",
      icon: <FaPencilAlt />,
    },
  ];

  const donorMenu = [
    { name: "Dashboard", path: "/donordashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/donordashboard/profile", icon: <CgProfile /> },
    {
      name: "My Donation Request",
      path: "/donordashboard/my-donation-requests",
      icon: <FaClipboardList />,
    },
    {
      name: "Create Donation Request",
      path: "/donordashboard/create-donation-request",
      icon: <MdCreate />,
    },
  ];

  const receiverMenu = [
    { name: "Dashboard", path: "/recipientdashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/recipientdashboard/profile", icon: <CgProfile /> },
    {
      name: "My Requests",
      path: "/recipientdashboard/my-donation-requests",
      icon: <FaClipboardList />,
    },
    {
      name: "Create Request",
      path: "/recipientdashboard/create-donation-request",
      icon: <MdCreate />,
    },
  ];

  const defaultMenu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
    {
      name: "All Donation Request",
      path: "/dashboard/all-blood-donation-request",
      icon: <FaClipboardList />,
    },
    {
      name: "Content Management",
      path: "/dashboard/content-management",
      icon: <FaPencilAlt />,
    },
  ];

  let menuItems = defaultMenu;

  if (role === "admin") menuItems = adminMenu;
  else if (role === "donor") menuItems = donorMenu;
  else if (role === "receiver") menuItems = receiverMenu;

  // Loading is now handled at DashboardLayout level to avoid double loaders
  // if (loading) return <Loader label="Loading sidebar..." />;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-nav border-b border-border shadow-nav z-[60] flex items-center justify-between px-4">
        <Link to={basePath} className="flex items-center space-x-2">
          <img
            src={logoSrc}
            alt="BloodBridge logo"
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(255,51,102,0.5)]"
            style={{ backgroundColor: 'transparent', mixBlendMode: 'normal' }}
          />
          <span className="font-black text-xl tracking-tight text-white">
            BloodBridge
          </span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[61] lg:hidden"
          onClick={closeSidebarOnMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-slate-950 border-r border-slate-800 shadow-2xl z-[62] transform transition-all duration-300 flex flex-col backdrop-blur-xl ${
          isMobile
            ? isOpen
              ? "w-72 translate-x-0"
              : "w-72 -translate-x-full"
            : isOpen
            ? "w-72"
            : "w-20"
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Logo & Toggle */}
          <div className="hidden lg:flex items-center justify-between h-16 px-4 border-b border-slate-800">
            <Link to={basePath} className="flex items-center space-x-3 group">
              <img
                src={logoSrc}
                alt="BloodBridge logo"
                className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(255,51,102,0.6)] transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: 'transparent', mixBlendMode: 'normal' }}
              />
              <span
                className={`font-black text-xl tracking-tight text-gray-100 transition-opacity duration-300 ${
                  !isOpen && "opacity-0 hidden"
                }`}
              >
                BloodBridge
              </span>
            </Link>
            <button
               onClick={toggleSidebar}
               className={`p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all duration-200 ${!isOpen && "mx-auto"}`}
            >
               {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Header (Side Drawer Internal) */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-slate-800">
            <Link
              to={basePath}
              className="flex items-center space-x-2"
              onClick={closeSidebarOnMobile}
            >
              <img
                src={logoSrc}
                alt="BloodBridge logo"
                className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(255,51,102,0.5)]"
                style={{ backgroundColor: 'transparent', mixBlendMode: 'normal' }}
              />
              <span className="font-black text-xl tracking-tight text-white">
                BloodBridge
              </span>
            </Link>
            <button
              onClick={closeSidebarOnMobile}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              <FaTimes />
            </button>
          </div>

          {/* Section Label */}
          <div className="px-4 mt-6 mb-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700 ${
                !isMobile && !isOpen ? "opacity-0 hidden" : ""
              }`}
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {role === "admin"
                  ? "Admin Panel"
                  : role === "donor"
                  ? "Donor Dashboard"
                  : role === "receiver"
                  ? "Recipient Dashboard"
                  : "Volunteer Panel"}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col mt-4 space-y-1 px-2">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.end || false} 
                onClick={closeSidebarOnMobile}
                title={item.name}
                aria-label={item.name}
                className={({ isActive }) =>
                  `group relative flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/50 scale-105"
                      : "text-gray-300 hover:text-white hover:bg-slate-800 hover:scale-105"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-emerald-500"}`}>
                      {item.icon}
                    </span>
                    <span
                      className={`transition-opacity duration-300 ${
                        !isMobile && !isOpen && "opacity-0 hidden"
                      }`}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <footer className="mt-auto pb-6 px-4 border-t border-slate-800 pt-4 space-y-3">
          {role === "donor" && (
            <Link
              to="/donordashboard/create-donation-request"
              onClick={() => isMobile && setIsOpen(false)}
              className={`group flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-105 ${
                (!isMobile && !isOpen) ? "w-10 px-0 rounded-full" : "" 
              }`}
            >
              <MdCreate className="text-lg" />
              {(isMobile || isOpen) && <span>New Request</span>}
            </Link>
          )}
          <Link
            to="/"
            onClick={() => isMobile && setIsOpen(false)}
            className={`group flex items-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              (!isMobile && !isOpen) ? "justify-center" : "justify-start"
            } text-gray-300 hover:text-white hover:bg-slate-800 hover:scale-105`}
          >
            <ArrowLeft className="text-lg flex-shrink-0 text-emerald-500 group-hover:-translate-x-1 transition-transform" />
            {(isMobile || isOpen) && (
              <span className="transition-opacity duration-300">
                Back to Home
              </span>
            )}
          </Link>
        </footer>
      </aside>

      {/* Mobile spacer to push content below mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Sidebar;
