import { useState, useEffect } from "react";
import { HiOutlineX, HiOutlineTrash, HiOutlineCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import { updateTask, updateTaskStatus, assignTask, deleteTask } from "../../api/taskApi";
import useAuthStore from "../../store/authStore";

const TaskDetailModal = ({ isOpen, onClose, task, projectId, members, onSuccess, onDelete }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "ADMIN";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "TODO");
      setPriority(task.priority || "MEDIUM");
      setAssigneeId(task.assignedTo || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Create updates object and only include changed values
      const updates = {};
      
      let needsGeneralUpdate = false;
      if (title !== task.title || description !== task.description || priority !== task.priority) {
        if (!title.trim()) {
           toast.error("Title cannot be empty");
           setIsSaving(false);
           return;
        }
        await updateTask(task.id, { title, description: description || undefined, priority });
        needsGeneralUpdate = true;
      }
      
      if (status !== task.status) {
        await updateTaskStatus(task.id, status);
        needsGeneralUpdate = true;
      }
      
      if (assigneeId !== (task.assignedTo || "")) {
        // assignTask API expects userId
        await assignTask(task.id, assigneeId || null); 
        needsGeneralUpdate = true;
      }

      if (needsGeneralUpdate) {
         toast.success("Task updated");
         // Rather than reconstructing the local object precisely, trigger a refetch or pass back to parent
         onSuccess();
      } else {
         onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task permanently?")) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted");
      onDelete(task.id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease]">
      <div className="bg-[#1a1a2e] border border-white/8 rounded-xl w-full max-w-2xl max-h-[90vh] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.4)] animate-[slideUp_0.3s_ease] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
             <span className="text-xs font-mono text-[#64748b]">TASK-{task.id?.substring(0,6).toUpperCase()}</span>
             {/* Delete allowed for admin or the assignee themselves */}
             {(isAdmin || user?.id === task.assignedTo) && (
               <button 
                 onClick={handleDelete}
                 disabled={isDeleting}
                 className="w-8 h-8 flex items-center justify-center text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                 title="Delete Task"
               >
                 <HiOutlineTrash />
               </button>
             )}
          </div>
          <div className="flex gap-2">
            <button
               onClick={handleSave}
               disabled={isSaving}
               className="flex items-center gap-1.5 px-4 py-1.5 bg-[#10b981]/10 text-[#10b981] text-sm font-medium rounded-lg hover:bg-[#10b981]/20 transition-all border border-[#10b981]/30"
            >
              {isSaving ? "Saving..." : <><HiOutlineCheck /> Save</>}
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-white/5 rounded-md transition-colors">
              <HiOutlineX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">
          {/* Main Info */}
          <div className="flex-1 flex flex-col gap-5">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full bg-transparent text-[#e2e8f0] text-xl font-bold outline-none border-b border-transparent focus:border-[#6c63ff] pb-1 transition-colors"
              />
            </div>
            
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium text-[#94a3b8] mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details, links, or context..."
                className="w-full flex-1 min-h-[150px] p-3 bg-[#0f0f1a] border border-white/10 rounded-lg text-[#e2e8f0] text-sm outline-none transition-all focus:border-[#6c63ff] resize-none"
              />
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-5">
            {/* Status */}
            <div>
              <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider mb-2 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full py-2 px-3 bg-[#0f0f1a] border border-white/10 rounded-lg text-[#e2e8f0] text-sm outline-none focus:border-[#6c63ff] appearance-none"
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider mb-2 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full py-2 px-3 bg-[#0f0f1a] border border-white/10 rounded-lg text-[#e2e8f0] text-sm outline-none focus:border-[#6c63ff] appearance-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider mb-2 block">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full py-2 px-3 bg-[#0f0f1a] border border-white/10 rounded-lg text-[#e2e8f0] text-sm outline-none focus:border-[#6c63ff] appearance-none"
              >
                <option value="">Unassigned</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.name} {member.id === user?.id ? "(You)" : ""}</option>
                ))}
              </select>
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/5">
               <p className="text-xs text-[#64748b]">
                 Created: {new Date(task.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
