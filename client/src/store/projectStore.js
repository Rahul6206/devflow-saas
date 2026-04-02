import { create } from "zustand";

const useProjectStore = create((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  setLoading: (isLoading) => set({ isLoading }),

  // Clear project data
  clearProjects: () =>
    set({
      projects: [],
      currentProject: null,
    }),
}));

export default useProjectStore;
