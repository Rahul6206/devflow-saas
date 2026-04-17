import { useState } from "react";
import { HiOutlineX, HiOutlineClipboardCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import { createTask } from "../../api/taskApi";

const CreateTaskModal = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Task title is required");

    setIsSubmitting(true);
    try {
      const res = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        projectId
      });
      toast.success("Task created!");
      
      // Cleanup & close
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      onSuccess(res.data?.task);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease]">
      <div className="bg-[#1a1a2e] border border-white/8 rounded-xl w-full max-w-lg shadow-[0_10px_30px_-5px_rgba(0,0,0,0.4)] animate-[slideUp_0.3s_ease] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h3 className="text-lg font-bold text-[#e2e8f0] flex items-center gap-2">
            <HiOutlineClipboardCheck className="text-[#a78bfa]" />
            New Task
          </h3>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
            <HiOutlineX className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#94a3b8]">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full py-2.5 px-3 bg-[#0f0f1a] border border-white/10 rounded-lg text-[#e2e8f0] text-sm outline-none transition-all focus:border-[#6c63ff]"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#94a3b8]">Description <span className="text-[#64748b] text-xs font-normal">(optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, links, or context..."
              rows={4}
              className="w-full py-2.5 px-3 bg-[#0f0f1a] border border-white/10 rounded-lg text-[#e2e8f0] text-sm outline-none transition-all focus:border-[#6c63ff] resize-none"
            />
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <label className="text-sm font-medium text-[#94a3b8]">Priority</label>
            <div className="flex gap-3">
              {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    priority === p 
                      ? p === 'HIGH' ? 'bg-red-500/20 border-red-500/50 text-red-500'
                      : p === 'MEDIUM' ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                      : 'bg-blue-500/20 border-blue-500/50 text-blue-500'
                      : 'bg-[#0f0f1a] border-white/10 text-[#64748b] hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent border border-white/10 rounded-lg text-[#94a3b8] text-sm font-medium hover:bg-[#1f2b4d] hover:text-[#e2e8f0] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-linear-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(108,99,255,0.3)] disabled:opacity-60 transition-all flex items-center gap-2"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
