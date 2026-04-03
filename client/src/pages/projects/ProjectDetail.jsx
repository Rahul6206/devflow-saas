import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineChevronLeft, HiOutlinePlus } from "react-icons/hi";
import toast from "react-hot-toast";

import useOrgStore from "../../store/orgStore";
import useTaskStore from "../../store/taskStore";
import { getProject } from "../../api/projectApi";
import { getTasks, updateTaskStatus } from "../../api/taskApi";

import KanbanBoard from "../../components/projects/KanbanBoard";
import CreateTaskModal from "../../components/projects/CreateTaskModal";
import TaskDetailModal from "../../components/projects/TaskDetailModal";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { members } = useOrgStore(); // from dashboard or org page
  const { tasks, setTasks, updateTaskInList, removeTask } = useTaskStore();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

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
    } catch (error) {
      toast.error("Failed to load project details");
      navigate("/projects");
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex items-center justify-between mb-6 shrink-0">
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

      {/* Board Layout area */}
      <div className="flex-1 overflow-hidden">
         <KanbanBoard 
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
