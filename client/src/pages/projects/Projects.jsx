import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineFolder,
  HiOutlinePlus,
  HiOutlineDotsVertical,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCalendar,
  HiOutlineClipboardList
} from "react-icons/hi";
import toast from "react-hot-toast";
import useProjectStore from "../../store/projectStore";
import useOrgStore from "../../store/orgStore";
import useAuthStore from "../../store/authStore";
import { getProjects, deleteProject } from "../../api/projectApi";
import CreateProjectModal from "../../components/projects/CreateProjectModal";

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { organization } = useOrgStore();
  const { projects, setProjects, isLoading, setLoading } = useProjectStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    fetchProjects();
  }, [organization]);

  const fetchProjects = async () => {
    if (!organization) return;
    
    setLoading(true);
    try {
      const res = await getProjects();
      const projData = res.data?.projects || res.data || [];
      setProjects(Array.isArray(projData) ? projData : []);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSuccess = (newProject) => {
    fetchProjects();
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    setActiveDropdown(null);
    
    if (!confirm("Are you sure you want to delete this project? All tasks will be lost.")) return;

    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success("Project deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-[fadeInUp_0.4s_ease]">
        <div className="w-16 h-16 bg-[#1a1a2e] border border-white/10 rounded-full flex items-center justify-center text-[#64748b] text-2xl mb-4">
          <HiOutlineFolder />
        </div>
        <h2 className="text-xl font-bold text-[#e2e8f0] mb-2">No Organization Yet</h2>
        <p className="text-[#94a3b8] max-w-sm mb-6">
          You need to create or join an organization before you can manage projects.
        </p>
        <button
          onClick={() => navigate("/organization")}
          className="px-5 py-2.5 bg-linear-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold rounded-lg"
        >
          Go to Organization
        </button>
      </div>
    );
  }

  return (
    <div className="animate-[fadeInUp_0.4s_ease] pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Projects</h1>
          <p className="text-[#94a3b8] text-sm mt-1">Manage your team's projects</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:-translate-y-0.5 transition-all"
        >
          <HiOutlinePlus className="text-lg" />
          New Project
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-[#1a1a2e] border border-white/5 rounded-xl h-40 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        /* Empty States */
        <div className="flex flex-col items-center justify-center bg-[#1a1a2e] border border-white/5 rounded-2xl py-16 text-center">
          <div className="w-20 h-20 bg-linear-to-br from-[#6c63ff]/10 to-[#a78bfa]/10 rounded-full flex items-center justify-center text-[#a78bfa] text-3xl mb-4 border border-[#6c63ff]/20">
            <HiOutlineFolder />
          </div>
          <h3 className="text-lg font-bold text-[#e2e8f0] mb-2">Create your first project</h3>
          <p className="text-[#94a3b8] text-sm max-w-sm mb-6">
            Organize your tasks efficiently. Projects are shared across your entire organization.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-[#e2e8f0] text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            <HiOutlinePlus className="text-lg" />
            New Project
          </button>
        </div>
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 flex-wrap">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="bg-[#1a1a2e] border border-white/8 rounded-xl p-5 cursor-pointer relative group transition-all duration-300 hover:border-[#6c63ff]/40 hover:shadow-[0_10px_30px_-10px_rgba(108,99,255,0.2)] hover:-translate-y-1 overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#6c63ff] to-[#a78bfa] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#6c63ff]/10 text-[#a78bfa] rounded-lg flex items-center justify-center text-2xl group-hover:bg-[#6c63ff]/20 transition-colors">
                  <HiOutlineFolder />
                </div>
                
                {/* Admin Actions Dropdown */}
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === project.id ? null : project.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-white/5 rounded-md transition-colors"
                    >
                      <HiOutlineDotsVertical />
                    </button>
                    
                    {activeDropdown === project.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-[#0f0f1a] border border-white/10 rounded-lg shadow-xl py-1 z-10 animate-[fadeIn_0.1s_ease]">
                        <button
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                        >
                          <HiOutlineTrash className="text-sm" /> Delete Project
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <h2 className="text-[#e2e8f0] font-bold text-lg mb-1 truncate group-hover:text-white transition-colors">
                {project.name}
              </h2>
              
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <HiOutlineClipboardList className="text-sm" />
                  <span>{project.tasks?.length || 0} Tasks</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <HiOutlineCalendar className="text-sm" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={handleProjectSuccess}
      />
    </div>
  );
};

export default Projects;
