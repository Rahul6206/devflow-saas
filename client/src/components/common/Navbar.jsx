import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineSearch, HiOutlineBell, HiOutlineCheck } from "react-icons/hi";
import useAuthStore from "../../store/authStore";
import { getNotifications, markNotificationsRead } from "../../api/notificationApi";
import { globalSearch } from "../../api/searchApi";

// Map route paths to page titles
const pageTitles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/organization": "Organization",
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ projects: [], tasks: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

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

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); 
      return () => clearInterval(interval);
    }
  }, [user]);

  // Debounced Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await globalSearch(searchQuery);
          setSearchResults(res.data);
          setIsSearchOpen(true);
        } catch (error) {
          console.error("Search failed");
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ projects: [], tasks: [] });
        setIsSearchOpen(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Outside click handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
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
        <div className="relative hidden md:block" ref={searchRef}>
          <div className="navbar-search relative flex items-center">
            {isSearching ? (
              <div className="absolute left-[12px] w-4 h-4 border-2 border-[#6c63ff]/30 border-t-[#6c63ff] rounded-full animate-spin pointer-events-none" />
            ) : (
              <HiOutlineSearch className="navbar-search-icon" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery.length > 1) setIsSearchOpen(true); }}
              className="navbar-search-input text-white flex-1 min-w-0 bg-[#0f0f1a]"
              placeholder="Search projects, tasks..."
              style={{ color: '#e2e8f0', lineHeight: 'normal' }}
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && (searchResults.projects.length > 0 || searchResults.tasks.length > 0) && (
            <div className="absolute top-full left-0 mt-2 w-[350px] bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-[fadeIn_0.1s_ease]">
              {/* Projects Result List */}
              {searchResults.projects.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-[0.65rem] font-bold text-[#64748b] uppercase tracking-wider">
                    Projects
                  </div>
                  {searchResults.projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        navigate(`/projects/${proj.id}`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors text-sm text-[#e2e8f0]"
                    >
                      {proj.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Tasks Result List */}
              {searchResults.tasks.length > 0 && (
                <div>
                  <div className="px-4 py-1 text-[0.65rem] font-bold text-[#64748b] uppercase tracking-wider border-t border-white/5 mt-1 pt-2">
                    Tasks
                  </div>
                  {searchResults.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        navigate(`/projects/${task.projectId}?taskId=${task.id}`);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors"
                    >
                      <div className="text-sm text-[#e2e8f0] font-medium truncate">{task.title}</div>
                      <div className="text-xs text-[#64748b] truncate mt-0.5">in {task.project?.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
