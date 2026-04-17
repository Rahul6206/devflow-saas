import { HiOutlineClock } from "react-icons/hi";

import useAuthStore from "../../store/authStore";

const priorityStyles = {
  HIGH: "bg-red-500/15 text-red-500 border-red-500/20",
  MEDIUM: "bg-amber-500/15 text-amber-500 border-amber-500/20",
  LOW: "bg-blue-500/15 text-blue-500 border-blue-500/20",
};

const TaskCard = ({ task, onClick, onDragStart }) => {
  const { user } = useAuthStore();
  const isAssignedToMe = task.assignedTo === user?.id;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      className={`shrink-0 bg-[#1a1a2e] border ${isAssignedToMe ? 'border-[#6c63ff]/30 shadow-[0_0_10px_rgba(108,99,255,0.1)]' : 'border-white/8 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.3)]'} rounded-lg p-3.5 cursor-grab active:cursor-grabbing hover:border-white/20 transition-all hover:-translate-y-0.5 relative overflow-hidden`}
    >
      {/* Assigned to me indicator strip */}
      {isAssignedToMe && (
        <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-[#6c63ff] to-[#a78bfa]"></div>
      )}

      <div className="flex items-start justify-between mb-2">
        {/* Priority Badge */}
        <span
          className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full border ${
            priorityStyles[task.priority] || priorityStyles.MEDIUM
          }`}
        >
          {task.priority || "MEDIUM"}
        </span>
        
        {/* Date / Time hint */}
        <div className="text-[0.65rem] text-[#64748b] flex items-center gap-1">
          <HiOutlineClock />
          {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      </div>

      <h4 className="text-sm font-semibold text-[#e2e8f0] mb-1.5 leading-snug">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-xs text-[#64748b] line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer / Assignee */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <div className="flex items-center flex-1">
          {isAssignedToMe && (
            <span className="text-[0.65rem] font-medium text-[#a78bfa] italic">
              You are assigned to this task
            </span>
          )}
        </div>

        {task.assignee ? (
          <div 
            className="w-6 h-6 rounded-full bg-linear-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-[0.6rem] font-bold text-white shadow-sm shrink-0"
            title={task.assignee.name}
          >
            {task.assignee.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border border-dashed border-[#64748b]/50 text-[#64748b] flex items-center justify-center text-[0.6rem] shrink-0" title="Unassigned">
            ?
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
