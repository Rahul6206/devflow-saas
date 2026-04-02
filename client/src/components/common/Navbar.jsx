import { useLocation } from "react-router-dom";
import { HiOutlineSearch, HiOutlineBell } from "react-icons/hi";
import useAuthStore from "../../store/authStore";

// Map route paths to page titles
const pageTitles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/organization": "Organization",
};

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  // Get page title from current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith("/projects/")) return "Project Details";
    return "DevFlow";
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        {/* Search */}
        <div className="navbar-search">
          <HiOutlineSearch className="navbar-search-icon" />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search projects, tasks..."
          />
        </div>

        {/* Notifications */}
        <button className="navbar-icon-btn" title="Notifications">
          <HiOutlineBell />
          <span className="navbar-notification-dot"></span>
        </button>

        {/* User avatar */}
        <div className="navbar-avatar" title={user?.name || "User"}>
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
