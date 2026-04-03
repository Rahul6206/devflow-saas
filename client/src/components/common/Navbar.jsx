import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { HiOutlineSearch, HiOutlineBell, HiOutlineCheck } from "react-icons/hi";
import useAuthStore from "../../store/authStore";
import { getNotifications, markNotificationsRead } from "../../api/notificationApi";

// Map route paths to page titles
const pageTitles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/organization": "Organization",
};

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith("/projects/")) return "Project Details";
    return "DevFlow";
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data?.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  // Pre-fetch notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Polling could be added here if websockets aren't present
      const interval = setInterval(fetchNotifications, 60000); // Poll every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle dropdown close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenDropdown = async () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && hasUnread) {
      try {
        await markNotificationsRead();
        // Optimistically update
        setNotifications(notifications.map(n => ({...n, isRead: true})));
      } catch (error) {
        console.error("Failed to mark notifications visually read");
      }
    }
  };

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <header className="navbar relative">
      <div className="navbar-left">
        <h1 className="navbar-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        {/* Search */}
        <div className="navbar-search hidden md:flex">
          <HiOutlineSearch className="navbar-search-icon" />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search projects, tasks..."
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            className="navbar-icon-btn" 
            title="Notifications"
            onClick={handleOpenDropdown}
          >
            <HiOutlineBell />
            {hasUnread && (
              <span className="navbar-notification-dot animate-pulse"></span>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-[fadeIn_0.2s_ease]">
              <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Notifications</h3>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-[#94a3b8]">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex gap-3 items-start ${!notif.isRead ? 'bg-[#6c63ff]/10' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#6c63ff]/20 flex items-center justify-center text-[#a78bfa] shrink-0 mt-0.5">
                        <HiOutlineBell className="text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notif.isRead ? 'text-white font-medium' : 'text-[#e2e8f0]'}`}>
                          {notif.message}
                        </p>
                        <p className="text-[0.65rem] text-[#64748b] mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="navbar-avatar" title={user?.name || "User"}>
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
