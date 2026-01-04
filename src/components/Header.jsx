import { useContext, useState } from "react";
import { CgMenuMotion } from "react-icons/cg";
import { FiChevronDown } from "react-icons/fi";
import { RiMenuAddLine } from "react-icons/ri";
import { Link, NavLink } from "react-router";
import useCurrentUser from "../hooks/useCurrentUser";
import useRole from "../hooks/useRole";
import { AuthContext } from "../providers/AuthProvider";
import { getAvatarUrl } from "../utils/avatarHelper";

const Header = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role } = useRole();
  const { currentUser } = useCurrentUser();
  
  // Get profile picture: prioritize user-uploaded image, fallback to gender-based avatar
  const profilePicture = currentUser?.image || currentUser?.photoURL || getAvatarUrl(currentUser?.gender);

  // Get dashboard path based on role
  const getDashboardPath = () => {
    if (role === "admin") return "/admindashboard";
    if (role === "donor") return "/donordashboard";
    if (role === "receiver") return "/recipientdashboard";
    return "/dashboard";
  };

  const dashboardPath = getDashboardPath();

  const menu = [
    { name: "Home", path: "/" },
    { name: "Search", path: "/search" },
    { name: "Request", path: "/request" },
    { name: "Blog", path: "/blog" },
    { name: "Help Center", path: "/help-center" },
  ];

  const handleNavLinkClick = () => setIsMenuOpen(false);

  const logoSrc = "/Logo.png";

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 shadow-lg border-b border-slate-800 backdrop-blur-xl">
      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src={logoSrc}
              alt="BloodBridge logo"
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain drop-shadow-[0_0_15px_rgba(255,51,102,0.6)] transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: 'transparent', mixBlendMode: 'normal' }}
            />
            <span className="text-xl lg:text-2xl font-black text-gray-100 tracking-tight group-hover:text-slate-400 transition-colors">
              BloodBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm xl:text-base transition-all duration-200 ${
                    isActive
                      ? "bg-slate-800 text-emerald-400 shadow-sm border border-slate-700"
                      : "text-gray-300 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user && user.email ? (
              <div className="relative">
                <div className="flex items-center space-x-3">
                  {profilePicture && (
                    <button
                      onClick={() => setIsMenuOpen((prev) => !prev)}
                      className="relative focus:outline-none"
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                    >
                      <img
                        src={profilePicture}
                        alt={user.displayName || currentUser?.name || "User"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 shadow-sm hover:border-emerald-500 transition-colors duration-200"
                        title={user.displayName || currentUser?.name || "User"}
                        key={profilePicture} // Force re-render when image changes
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 shadow-sm flex items-center justify-center pointer-events-none">
                        <FiChevronDown
                          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                            isMenuOpen ? "rotate-180" : "rotate-0"
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  )}
                </div>

                {/* Role indicator (donor / receiver) */}
                {role && (
                  <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-gray-300 border border-slate-700 whitespace-nowrap">
                    Logged in as{" "}
                    <span className="capitalize text-emerald-400">
                      {role === "receiver" ? "recipient" : role}
                    </span>
                  </div>
                )}

                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50"
                    role="menu"
                  >
                    <NavLink
                      to={dashboardPath}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm ${
                          isActive
                            ? "text-emerald-400 bg-slate-800"
                            : "text-gray-300 hover:text-white hover:bg-slate-800"
                        }`
                      }
                      role="menuitem"
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/registration"
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:shadow-lg hover:bg-emerald-500 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {user && profilePicture && (
              <div className="relative">
                <img
                  src={profilePicture}
                  alt={user.displayName || currentUser?.name || "User"}
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-700 shadow-sm"
                  title={user.displayName || currentUser?.name || "User"}
                  key={profilePicture} // Force re-render when image changes
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <CgMenuMotion className="w-6 h-6" />
              ) : (
                <RiMenuAddLine className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 border-t border-slate-800 bg-slate-900 rounded-b-xl px-2">
            <div className="space-y-1">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-slate-800 text-emerald-400 border-l-4 border-emerald-500"
                        : "text-gray-300 hover:text-white hover:bg-slate-800"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Auth Actions */}
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
                {user && user.email ? (
                  <>
                    <NavLink
                      to={dashboardPath}
                      onClick={handleNavLinkClick}
                      className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        logOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-base font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <NavLink
                      to="/login"
                      onClick={handleNavLinkClick}
                      className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/registration"
                      onClick={handleNavLinkClick}
                      className="block px-4 py-3 text-base font-medium bg-emerald-600 text-white rounded-lg text-center transition-all duration-200"
                    >
                      Register
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
