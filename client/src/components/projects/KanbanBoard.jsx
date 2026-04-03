import { useMemo } from "react";
import KanbanColumn from "./KanbanColumn";
import useTaskStore from "../../store/taskStore";

const KanbanBoard = ({ onTaskClick, onTaskMove }) => {
  const { tasks } = useTaskStore();

  // Group tasks by status
  const columns = useMemo(() => {
    const defaultCols = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: []
    };

    tasks.forEach(task => {
      if (defaultCols[task.status]) {
        defaultCols[task.status].push(task);
      }
    });
    
    return defaultCols;
  }, [tasks]);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
    // Subtle visual effect on the ghost image doesn't work perfectly on all browsers natively,
    // but Native HTML5 sets the drag effect
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 h-full min-h-[500px]">
      <KanbanColumn
        status="TODO"
        title="To Do"
        colorDot="bg-blue-500"
        dragColor="border-blue-500/50 bg-blue-500/5"
        tasks={columns.TODO}
        onOptionClick={onTaskClick}
        onDragStart={handleDragStart}
        onDrop={onTaskMove}
      />
      <KanbanColumn
        status="IN_PROGRESS"
        title="In Progress"
        colorDot="bg-amber-500"
        dragColor="border-amber-500/50 bg-amber-500/5"
        tasks={columns.IN_PROGRESS}
        onOptionClick={onTaskClick}
        onDragStart={handleDragStart}
        onDrop={onTaskMove}
      />
      <KanbanColumn
        status="DONE"
        title="Done"
        colorDot="bg-emerald-500"
        dragColor="border-emerald-500/50 bg-emerald-500/5"
        tasks={columns.DONE}
        onOptionClick={onTaskClick}
        onDragStart={handleDragStart}
        onDrop={onTaskMove}
      />
    </div>
  );
};

export default KanbanBoard;
