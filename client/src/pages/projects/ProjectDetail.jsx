import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineChevronLeft, HiOutlinePlus, HiOutlineFilter } from "react-icons/hi";
import toast from "react-hot-toast";

import useOrgStore from "../../store/orgStore";
import useAuthStore from "../../store/authStore";
import useTaskStore from "../../store/taskStore";
import { getProject } from "../../api/projectApi";
import { getTasks, updateTaskStatus } from "../../api/taskApi";

import KanbanBoard from "../../components/projects/KanbanBoard";
import CreateTaskModal from "../../components/projects/CreateTaskModal";
import TaskDetailModal from "../../components/projects/TaskDetailModal";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { members } = useOrgStore(); // from dashboard or org page
  const { tasks, setTasks, updateTaskInList, removeTask } = useTaskStore();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  // Filters State
  const [filterAssignee, setFilterAssignee] = useState("ALL"); // "ALL" | "ME"
  const [filterPriority, setFilterPriority] = useState("ALL"); // "ALL" | "HIGH" | "MEDIUM" | "LOW"

  useEffect(() => {
    fetchProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchProjectData = async () => {
    setIsLoading(true);
    try {
      const [projRes, tasksRes] = await Promise.all([
        getProject(projectId),
        getTasks(projectId)
      ]);
      setProject(projRes.data?.project || null);
      
      const tasksData = tasksRes.data?.tasks || tasksRes.data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);

      // Check URL for deep-linked task
      const queryTaskId = searchParams.get('taskId');
      if (queryTaskId) {
        const foundTask = tasksData.find(t => t.id === queryTaskId);
        if (foundTask) setActiveTask(foundTask);
        // Clear param so it doesn't pop again on refresh unless intended
        setSearchParams({});
      }

    } catch (error) {
      toast.error("Failed to load project details");
      navigate("/projects");
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized filter logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Assignee Filter
      if (filterAssignee === "ME" && task.assignedTo !== user?.id) return false;
      // Priority Filter
      if (filterPriority !== "ALL" && task.priority !== filterPriority) return false;
      return true;
    });
  }, [tasks, filterAssignee, filterPriority, user]);

  const handleTaskCreated = (newTask) => {
    // Add to local state (append at the beginning or end)
    setTasks([newTask, ...tasks]);
  };

  const handleTaskUpdated = () => {
    // Since task detail handles a lot of complexity (assignedTo string -> obj resolution),
    // easiest valid way to sync the local board is resolving via a quick refetch over network
    // Alternatively, we could manually update task objects based on API response
    fetchProjectData();
    setActiveTask(null);
  };
  
  const handleTaskDeleted = (taskId) => {
    removeTask(taskId);
    setActiveTask(null);
  };

  const handleTaskMove = async (taskId, newStatus) => {
    // Optimistically update
    const taskObj = tasks.find(t => t.id === taskId);
    if (!taskObj || taskObj.status === newStatus) return;

    const oldStatus = taskObj.status;
    updateTaskInList(taskId, { status: newStatus });

    // Sync to backend
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      // Revert if failed
      toast.error("Failed to move task");
      updateTaskInList(taskId, { status: oldStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#6c63ff]/30 border-t-[#6c63ff] rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="animate-[fadeInUp_0.4s_ease] h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/projects")}
            className="w-10 h-10 flex items-center justify-center bg-[#1a1a2e] border border-white/8 text-[#94a3b8] rounded-lg hover:bg-white/5 hover:text-[#e2e8f0] transition-colors"
          >
            <HiOutlineChevronLeft className="text-xl" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-[#e2e8f0]">{project.name}</h1>
            <p className="text-[#94a3b8] text-sm mt-0.5">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} in total
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateTaskOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:-translate-y-0.5 transition-all"
        >
          <HiOutlinePlus className="text-lg" />
          Add Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5 shrink-0 px-1">
        <div className="flex items-center gap-2 text-sm text-[#94a3b8] font-medium">
          <HiOutlineFilter className="text-lg" />
          Filters:
        </div>
        
        {/* Assignee FilterToggle */}
        <button
          onClick={() => setFilterAssignee(filterAssignee === "ALL" ? "ME" : "ALL")}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all border ${
            filterAssignee === "ME" 
              ? "bg-[#6c63ff]/20 text-[#a78bfa] border-[#6c63ff]/50" 
              : "bg-[#1a1a2e] text-[#64748b] border-white/10 hover:bg-white/5"
          }`}
        >
          Only My Tasks
        </button>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-[#1a1a2e] border border-white/10 text-[#e2e8f0] text-xs font-bold py-1.5 px-3 rounded-md outline-none cursor-pointer hover:border-white/20 transition-colors"
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>
      </div>

      {/* Board Layout area */}
      <div className="flex-1 overflow-hidden">
         <KanbanBoard 
           tasks={filteredTasks}
           onTaskClick={(task) => setActiveTask(task)} 
           onTaskMove={handleTaskMove}
         />
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        projectId={projectId}
        onSuccess={handleTaskCreated}
      />
      
      <TaskDetailModal
        isOpen={!!activeTask}
        onClose={() => setActiveTask(null)}
        task={activeTask}
        projectId={projectId}
        members={members}
        onSuccess={handleTaskUpdated}
        onDelete={handleTaskDeleted}
      />
    </div>
  );
};

export default ProjectDetail;
