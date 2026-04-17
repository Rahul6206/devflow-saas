import { useEffect, useState } from "react";
import {
  HiOutlineOfficeBuilding,
  HiOutlineUserAdd,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineShieldCheck,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineMail,
} from "react-icons/hi";
import { BsLightningCharge } from "react-icons/bs";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import useOrgStore from "../../store/orgStore";
import {
  createOrg,
  getMyOrg,
  getOrgMembers,
  updateOrg,
  deleteOrg,
  addMember,
  removeMember,
  changeMemberRole,
} from "../../api/orgApi";

const Organization = () => {
  const { user } = useAuthStore();
  const { organization, members, setOrganization, setMembers, clearOrg } =
    useOrgStore();

  const [isLoading, setIsLoading] = useState(true);
  const [hasOrg, setHasOrg] = useState(false);

  // Create org form
  const [orgName, setOrgName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Add member form
  const [memberEmail, setMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  // Edit org name
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");

  // Delete confirm
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  // Fetch org data on mount
  useEffect(() => {
    fetchOrgData();
  }, []);

  const fetchOrgData = async () => {
    setIsLoading(true);
    try {
      const orgRes = await getMyOrg();
      if (orgRes.data) {
        setOrganization(orgRes.data);
        setHasOrg(true);
        setEditName(orgRes.data.name);

        const memberRes = await getOrgMembers();
        const memberList = memberRes.data?.members || [];
        setMembers(Array.isArray(memberList) ? memberList : []);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setHasOrg(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Create organization
  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) return toast.error("Please enter organization name");

    setIsCreating(true);
    try {
      const res = await createOrg({ name: orgName.trim() });
      toast.success("Organization created successfully! 🎉");
      setOrgName("");
      // Refresh data
      await fetchOrgData();
      // Update user role in auth store
      useAuthStore.getState().setUser({ ...user, role: "ADMIN" });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create organization"
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Update org name
  const handleUpdateName = async () => {
    if (!editName.trim()) return toast.error("Name cannot be empty");
    if (editName.trim() === organization?.name) {
      setIsEditingName(false);
      return;
    }

    try {
      await updateOrg({ name: editName.trim() });
      setOrganization({ ...organization, name: editName.trim() });
      toast.success("Organization name updated");
      setIsEditingName(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  // Delete organization
  const handleDeleteOrg = async () => {
    try {
      await deleteOrg();
      clearOrg();
      setHasOrg(false);
      setShowDeleteConfirm(false);
      useAuthStore.getState().setUser({ ...user, role: "MEMBER" });
      toast.success("Organization deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  // Add member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return toast.error("Please enter email");

    setIsAddingMember(true);
    try {
      await addMember({ email: memberEmail.trim() });
      toast.success("Member added successfully!");
      setMemberEmail("");
      setShowAddMember(false);
      // Refresh members
      const memberRes = await getOrgMembers();
      setMembers(memberRes.data?.members || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to add member"
      );
    } finally {
      setIsAddingMember(false);
    }
  };

  // Remove member
  const handleRemoveMember = async (userId, memberName) => {
    if (!confirm(`Remove ${memberName} from the organization?`)) return;

    try {
      await removeMember(userId);
      setMembers(members.filter((m) => m.id !== userId));
      toast.success(`${memberName} removed`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
    }
  };

  // Change role
  const handleChangeRole = async (userId, currentRole, memberName) => {
    const newRole = currentRole === "ADMIN" ? "MEMBER" : "ADMIN";
    try {
      await changeMemberRole(userId, { role: newRole });
      setMembers(
        members.map((m) => (m.id === userId ? { ...m, role: newRole } : m))
      );
      toast.success(`${memberName} is now ${newRole}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change role");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#6c63ff]/30 border-t-[#6c63ff] rounded-full animate-spin" />
      </div>
    );
  }

  // ========== NO ORGANIZATION — SHOW CREATE FORM ==========
  if (!hasOrg) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-[fadeInUp_0.4s_ease]">
        <div className="w-full max-w-md bg-[#1a1a2e] border border-white/8 rounded-2xl p-8 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.4)]">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-[#6c63ff] to-[#a78bfa] rounded-xl inline-flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-[0_0_20px_rgba(108,99,255,0.3)]">
              <BsLightningCharge />
            </div>
            <h2 className="text-2xl font-bold text-[#e2e8f0] mb-1">
              Create Your Organization
            </h2>
            <p className="text-sm text-[#94a3b8]">
              Set up your workspace to start collaborating with your team.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateOrg} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#94a3b8]">
                Organization Name
              </label>
              <div className="relative">
                <HiOutlineOfficeBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] text-lg pointer-events-none" />
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme Corp, My Team"
                  className="w-full py-3 pl-10 pr-4 bg-[#0f0f1a] border border-white/8 rounded-lg text-[#e2e8f0] text-sm outline-none transition-all focus:border-[#6c63ff] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.15)] placeholder:text-[#64748b]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-3 bg-linear-to-r from-[#6c63ff] to-[#a78bfa] text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer border-none text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Organization"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#64748b] mt-4">
            You'll be set as the Admin of this organization.
          </p>
        </div>
      </div>
    );
  }

  // ========== HAS ORGANIZATION — SHOW ORG DASHBOARD ==========
  return (
    <div className="animate-[fadeInUp_0.4s_ease] space-y-6">
      {/* Org Header */}
      <div className="bg-[#1a1a2e] border border-white/8  rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-[#6c63ff] to-[#a78bfa] rounded-xl flex items-center justify-center text-white text-xl shadow-[0_0_20px_rgba(108,99,255,0.3)]">
              <HiOutlineOfficeBuilding />
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-[#0f0f1a] border border-[#6c63ff] rounded-lg px-3 py-1.5 text-[#e2e8f0] text-lg font-bold outline-none"
                    autoFocus
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleUpdateName()
                    }
                  />
                  <button
                    onClick={handleUpdateName}
                    className="w-8 h-8 bg-emerald-500/10 text-emerald-500 rounded-lg flex items-center justify-center hover:bg-emerald-500/20 transition-all cursor-pointer border-none"
                  >
                    <HiOutlineCheck />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setEditName(organization?.name);
                    }}
                    className="w-8 h-8 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-all cursor-pointer border-none"
                  >
                    <HiOutlineX />
                  </button>
                </div>
              ) : (
                <h2 className="text-xl font-bold text-[#e2e8f0]">
                  {organization?.name}
                </h2>
              )}
              <p className="text-sm text-[#64748b] mt-0.5">
                {members.length} member{members.length !== 1 ? "s" : ""} ·{" "}
                Your role:{" "}
                <span
                  className={`font-semibold ${
                    isAdmin ? "text-[#a78bfa]" : "text-[#94a3b8]"
                  }`}
                >
                  {user?.role || "MEMBER"}
                </span>
              </p>
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-transparent border border-white/8 rounded-lg text-[#94a3b8] text-sm font-medium cursor-pointer transition-all hover:bg-[#1f2b4d] hover:text-[#e2e8f0] hover:border-[rgba(108,99,255,0.5)]"
              >
                <HiOutlinePencil />
                Rename
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-transparent border border-red-500/20 rounded-lg text-red-500 text-sm font-medium cursor-pointer transition-all hover:bg-red-500/10 hover:border-red-500/40"
              >
                <HiOutlineTrash />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] border border-white/8 rounded-xl p-6 w-full max-w-sm shadow-[0_10px_30px_-5px_rgba(0,0,0,0.4)] animate-[fadeInUp_0.2s_ease]">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">
                <HiOutlineTrash />
              </div>
              <h3 className="text-lg font-bold text-[#e2e8f0] mb-1">
                Delete Organization?
              </h3>
              <p className="text-sm text-[#94a3b8] mb-5">
                This will remove all members and permanently delete{" "}
                <strong>{organization?.name}</strong>. This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 bg-transparent border border-white/8 rounded-lg text-[#94a3b8] text-sm font-medium cursor-pointer transition-all hover:bg-[#1f2b4d] hover:text-[#e2e8f0]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrg}
                  className="flex-1 py-2.5 bg-red-500 border-none rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Section */}
      <div className="bg-[#1a1a2e] border border-white/8 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <h3 className="text-base font-semibold text-[#e2e8f0]">
              Team Members
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              Manage your organization's team
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold rounded-lg shadow-[0_0_20px_rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer border-none"
            >
              <HiOutlineUserAdd />
              Add Member
            </button>
          )}
        </div>

        {/* Add Member Form */}
        {showAddMember && (
          <div className="px-6 py-4 bg-[#0f0f1a]/50 border-b border-white/8">
            <form
              onSubmit={handleAddMember}
              className="flex items-center gap-3"
            >
              <div className="relative flex-1">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="Enter member's email address"
                  className="w-full py-2.5 pl-10 pr-4 bg-[#1a1a2e] border border-white/8 rounded-lg text-[#e2e8f0] text-sm outline-none transition-all focus:border-[#6c63ff] focus:shadow-[0_0_0_2px_rgba(108,99,255,0.12)] placeholder:text-[#64748b]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isAddingMember}
                className="px-5 py-2.5 bg-linear-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold rounded-lg cursor-pointer border-none transition-all hover:shadow-[0_0_20px_rgba(108,99,255,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAddingMember ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Invite"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddMember(false);
                  setMemberEmail("");
                }}
                className="w-9 h-9 bg-transparent border border-white/8 rounded-lg flex items-center justify-center text-[#94a3b8] cursor-pointer transition-all hover:bg-[#1f2b4d] hover:text-[#e2e8f0]"
              >
                <HiOutlineX />
              </button>
            </form>
          </div>
        )}

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/8 text-xs uppercase tracking-wider text-[#64748b]">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {members.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-[#64748b]">
                    <HiOutlineUserAdd className="text-3xl mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-[#94a3b8]">No members yet</p>
                    <p className="text-xs">Invite team members to collaborate</p>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-[#6c63ff] to-[#a78bfa] rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                          {member.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#e2e8f0]">
                              {member.name}
                            </span>
                            {member.id === user?.id && (
                              <span className="text-[0.65rem] px-1.5 py-0.5 bg-[#6c63ff]/15 text-[#a78bfa] rounded font-medium">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#64748b]">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          member.role === "ADMIN"
                            ? "bg-[#a78bfa]/15 text-[#a78bfa]"
                            : "bg-white/10 text-[#94a3b8]"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {isAdmin && member.id !== user?.id && (
                          <>
                            <button
                              onClick={() =>
                                handleChangeRole(
                                  member.id,
                                  member.role,
                                  member.name
                                )
                              }
                              title={
                                member.role === "ADMIN"
                                  ? "Demote to Member"
                                  : "Promote to Admin"
                              }
                              className="w-8 h-8 bg-transparent border border-white/8 rounded-lg flex items-center justify-center text-[#94a3b8] cursor-pointer transition-all hover:bg-[#6c63ff]/10 hover:text-[#a78bfa] hover:border-[#6c63ff]/30"
                            >
                              <HiOutlineShieldCheck className="text-sm" />
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveMember(member.id, member.name)
                              }
                              title="Remove member"
                              className="w-8 h-8 bg-transparent border border-white/8 rounded-lg flex items-center justify-center text-[#94a3b8] cursor-pointer transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                            >
                              <HiOutlineTrash className="text-sm" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Organization;
