import { create } from "zustand";

const useOrgStore = create((set) => ({
  organization: null,
  members: [],
  isLoading: false,

  setOrganization: (organization) => set({ organization }),
  setMembers: (members) => set({ members }),
  setLoading: (isLoading) => set({ isLoading }),

  // Clear org data (on logout or org delete)
  clearOrg: () =>
    set({
      organization: null,
      members: [],
    }),
}));

export default useOrgStore;
