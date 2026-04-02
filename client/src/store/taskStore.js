import { create } from "zustand";

const useTaskStore = create((set) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,

  setTasks: (tasks) => set({ tasks }),
  setCurrentTask: (currentTask) => set({ currentTask }),
  setLoading: (isLoading) => set({ isLoading }),

  // Update a single task in the list (for status changes, assignments)
  updateTaskInList: (taskId, updatedData) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      ),
    })),

  // Remove a task from list
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),

  // Clear task data
  clearTasks: () =>
    set({
      tasks: [],
      currentTask: null,
    }),
}));

export default useTaskStore;
