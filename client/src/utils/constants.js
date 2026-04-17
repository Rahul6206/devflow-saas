// Task status constants (matches backend enum)
export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
};

// User roles (matches backend enum)
export const ROLES = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

// Kanban column config
export const KANBAN_COLUMNS = [
  { id: TASK_STATUS.TODO, title: "To Do", color: "#6366f1" },
  { id: TASK_STATUS.IN_PROGRESS, title: "In Progress", color: "#f59e0b" },
  { id: TASK_STATUS.DONE, title: "Done", color: "#10b981" },
];
