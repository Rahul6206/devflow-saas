import { NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlineOfficeBuilding,
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { BsLightningCharge } from "react-icons/bs";
import useAuthStore from "../../store/authStore";
import { logoutUser } from "../../api/authApi";
import toast from "react-hot-toast";
import { useState } from "react";

const navItems = [
  {
    path: "/dashboard",
    icon: HiOutlineViewGrid,
    label: "Dashboard",
  },
  {
    path: "/projects",
    icon: HiOutlineFolder,
    label: "Projects",
  },
  {
    path: "/organization",
    icon: HiOutlineOfficeBuilding,
    label: "Organization",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout: clearAuth } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logoutUser(refreshToken);
    } catch (err) {
      // Even if API fails, clear local auth
    } finally {
      clearAuth();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <BsLightningCharge />
          </div>
          {!collapsed && <span className="sidebar-logo-text">DevFlow</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {!collapsed && (
          <span className="sidebar-section-label">MAIN MENU</span>
        )}
        <ul className="sidebar-menu">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                }
                title={item.label}
              >
                <item.icon className="sidebar-link-icon" />
                {!collapsed && (
                  <span className="sidebar-link-text">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User + Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-email">
                {user?.email }
              </span>
            </div>
          )}
        </div>
        <button
          className="sidebar-logout"
          onClick={handleLogout}
          title="Logout"
        >
          <HiOutlineLogout />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
