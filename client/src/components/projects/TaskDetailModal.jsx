import { useState, useEffect } from "react";
import { HiOutlineX, HiOutlineTrash, HiOutlineCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import { updateTask, updateTaskStatus, assignTask, deleteTask, getComments, addComment } from "../../api/taskApi";
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

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const fetchComments = async (taskId) => {
    try {
      const res = await getComments(taskId);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "TODO");
      setPriority(task.priority || "MEDIUM");
      setAssigneeId(task.assignedTo || "");
      fetchComments(task.id);
    }
  }, [task, isOpen]);

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if(!newComment.trim()) return;
    setIsCommenting(true);
    try {
      const res = await addComment(task.id, newComment.trim());
      setComments([...comments, res.data.comment]);
      setNewComment("");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
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
            
            <div className="flex-1 flex flex-col min-h-[150px]">
              <label className="text-sm font-medium text-[#94a3b8] mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details, links, or context..."
                className="w-full h-[120px] p-3 bg-[#0f0f1a] border border-white/10 rounded-lg text-[#e2e8f0] text-sm outline-none transition-all focus:border-[#6c63ff] resize-none mb-6"
              />

              {/* Discussion Section */}
              <div className="mt-2 flex flex-col flex-1 border-t border-white/5 pt-6">
                <label className="text-sm font-bold text-[#e2e8f0] mb-4 flex items-center gap-2">
                  Discussion <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full">{comments.length}</span>
                </label>
                
                {/* Comments Feed */}
                <div className="flex-1 overflow-y-auto pr-2 mb-4 space-y-4 max-h-[200px]">
                  {comments.length === 0 ? (
                    <p className="text-xs text-[#64748b] italic">No comments yet. Start the conversation!</p>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.id} className="flex gap-3 animate-[fadeIn_0.2s_ease]">
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#6c63ff]/20 to-[#a78bfa]/20 border border-[#6c63ff]/30 flex items-center justify-center text-[0.65rem] font-bold text-[#e2e8f0] shrink-0 mt-0.5">
                          {comment.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 bg-[#0f0f1a] p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-white/5 relative group">
                           <div className="flex items-center justify-between mb-1">
                             <span className="text-xs font-semibold text-[#a78bfa]">{comment.user?.name}</span>
                             <span className="text-[0.6rem] text-[#64748b]">{new Date(comment.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className="text-xs text-[#e2e8f0] leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="mt-auto relative">
                  <div className="w-8 h-8 absolute left-2 top-2 rounded-full bg-linear-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-[0.65rem] font-bold text-white shrink-0 shadow-sm pointer-events-none">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or post an update..."
                    disabled={isCommenting}
                    className="w-full py-2.5 pl-12 pr-4 bg-[#0f0f1a] border border-white/10 rounded-full text-[#e2e8f0] text-xs outline-none transition-all focus:border-[#6c63ff] focus:shadow-[0_0_0_2px_rgba(108,99,255,0.15)] disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={isCommenting || !newComment.trim()}
                    className="hidden"
                  >Submit</button>
                </form>
              </div>
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
