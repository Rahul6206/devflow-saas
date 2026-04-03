import { useState } from "react";
import TaskCard from "./TaskCard";
import { HiOutlinePlus } from "react-icons/hi";

const KanbanColumn = ({ status, title, colorDot, dragColor, tasks, onOptionClick, onDragStart, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      onDrop(taskId, status);
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#0f0f1a] border rounded-xl overflow-hidden min-w-[300px] max-w-[350px] flex-1 transition-colors duration-200 ${
        isDragOver ? dragColor : "border-white/5"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#1a1a2e]/50">
        <div className="flex items-center gap-2">
          {/* Status color dot */}
          <div className={`w-2.5 h-2.5 rounded-full ${colorDot}`} />
          <h3 className="text-sm font-bold text-[#e2e8f0]">{title}</h3>
          <span className="text-xs bg-white/5 text-[#94a3b8] px-2 py-0.5 rounded-full ml-1">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Column Body / Drop Zone */}
      <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3 min-h-[150px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onOptionClick}
            onDragStart={onDragStart}
          />
        ))}

        {tasks.length === 0 && !isDragOver && (
          <div className="flex-1 flex flex-col items-center justify-center text-[#64748b] text-xs py-8 border-2 border-dashed border-white/5 rounded-lg">
            No tasks here
          </div>
        )}
        
        {isDragOver && (
          <div className="flex-1 min-h-[60px] border-2 border-dashed border-white/20 rounded-lg bg-white/5 transition-all" />
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
