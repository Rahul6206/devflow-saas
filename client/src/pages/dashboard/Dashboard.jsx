import { useEffect, useState } from "react";
import {
  HiOutlineFolder,
  HiOutlineClipboardCheck,
  HiOutlineUserGroup,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import useAuthStore from "../../store/authStore";
import { getProjects } from "../../api/projectApi";
import { getMyOrg, getOrgMembers } from "../../api/orgApi";
import useOrgStore from "../../store/orgStore";

const Dashboard = () => {
  const { user } = useAuthStore();
  const { organization, setOrganization, setMembers } = useOrgStore();
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    members: 0,
  });
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOrg, setHasOrg] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Step 1: Check if user has an organization
        const orgRes = await getMyOrg();
        if (orgRes.data) {
          setOrganization(orgRes.data);
          setHasOrg(true);

          // Step 2: Only fetch projects & members if user has an org
          const [projRes, memberRes] = await Promise.all([
            getProjects(),
            getOrgMembers(),
          ]);

          const projectList = projRes.data?.projects || projRes.data || [];
          setProjects(Array.isArray(projectList) ? projectList : []);

          const memberList = memberRes.data?.members || memberRes.data || [];
          setMembers(Array.isArray(memberList) ? memberList : []);

          // Calculate stats
          let totalTasks = 0;
          projectList.forEach((proj) => {
            totalTasks += proj.tasks?.length || 0;
          });

          setStats({
            projects: projectList.length,
            tasks: totalTasks,
            members: memberList.length,
          });
        }
      } catch (error) {
        // 404 = user has no org (expected for new users, not an error)
        if (error.response?.status === 404) {
          setHasOrg(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const statCards = [
    {
      label: "Projects",
      value: stats.projects,
      icon: HiOutlineFolder,
      color: "#6c63ff",
      bg: "rgba(108, 99, 255, 0.1)",
    },
    {
      label: "Total Tasks",
      value: stats.tasks,
      icon: HiOutlineClipboardCheck,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Team Members",
      value: stats.members,
      icon: HiOutlineUserGroup,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Active Sprint",
      value: stats.projects > 0 ? "1" : "0",
      icon: HiOutlineLightningBolt,
      color: "#ec4899",
      bg: "rgba(236, 72, 153, 0.1)",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <h2>
          {getGreeting()},{" "}
          <span className="text-accent">{user?.name || "Developer"}</span> 👋
        </h2>
        <p>Here's what's happening with your projects today.</p>
      </div>

      {/* No Org Banner */}
      {!isLoading && !hasOrg && (
        <div className="no-org-banner">
          <HiOutlineLightningBolt className="no-org-icon" />
          <div>
            <h3>Get started with DevFlow</h3>
            <p>Create or join an organization to start managing projects.</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/organization")}
          >
            Setup Organization
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-card-header">
              <div
                className="stat-icon"
                style={{ background: stat.bg, color: stat.color }}
              >
                <stat.icon />
              </div>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-value">
              {isLoading ? (
                <div className="stat-skeleton"></div>
              ) : (
                stat.value
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Projects */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Recent Projects</h3>
            <span className="dashboard-card-badge">{projects.length}</span>
          </div>
          <div className="dashboard-card-body">
            {isLoading ? (
              <div className="dashboard-empty">Loading...</div>
            ) : projects.length === 0 ? (
              <div className="dashboard-empty">
                <HiOutlineFolder className="dashboard-empty-icon" />
                <p>No projects yet</p>
                <span>
                  {hasOrg
                    ? "Create your first project to get started"
                    : "Setup an organization first"}
                </span>
              </div>
            ) : (
              <ul className="project-list">
                {projects.slice(0, 5).map((project) => (
                  <li key={project.id} className="project-list-item">
                    <div className="project-list-icon">
                      <HiOutlineFolder />
                    </div>
                    <div className="project-list-info">
                      <span className="project-list-name">{project.name}</span>
                      <span className="project-list-tasks">
                        {project.tasks?.length || 0} tasks
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="dashboard-card-body">
            <div className="quick-actions">
              <button
                className="quick-action-btn"
                onClick={() => (window.location.href = "/projects")}
              >
                <HiOutlineFolder />
                <span>New Project</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => (window.location.href = "/organization")}
              >
                <HiOutlineUserGroup />
                <span>Manage Team</span>
              </button>
              <button className="quick-action-btn">
                <HiOutlineClipboardCheck />
                <span>Create Task</span>
              </button>
            </div>

            {/* Organization Info */}
            {organization && (
              <div className="org-info-card">
                <HiOutlineLightningBolt className="org-info-icon" />
                <div>
                  <span className="org-info-name">{organization.name}</span>
                  <span className="org-info-label">Your Organization</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
