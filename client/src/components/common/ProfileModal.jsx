import { useState, useEffect } from "react";
import { HiOutlineUser, HiOutlineX } from "react-icons/hi";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import { updateProfile } from "../../api/authApi";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");

    setIsSubmitting(true);
    try {
      const res = await updateProfile({ name: name.trim() });
      toast.success("Profile updated successfully!");
      
      // Update local Zustand store instantly
      setUser(res.data.user);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease]">
      <div className="bg-[#1a1a2e] border border-white/8 rounded-xl w-full max-w-sm shadow-[0_10px_30px_-5px_rgba(0,0,0,0.4)] animate-[slideUp_0.3s_ease] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h3 className="text-lg font-bold text-[#e2e8f0] flex items-center gap-2">
            <HiOutlineUser className="text-[#a78bfa]" />
            Edit Profile
          </h3>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors"
          >
            <HiOutlineX className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-2 mb-6">
            <label className="text-sm font-medium text-[#94a3b8]">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full py-2.5 px-3 bg-[#0f0f1a] border border-white/10 rounded-lg text-[#e2e8f0] text-sm outline-none transition-all focus:border-[#6c63ff] focus:shadow-[0_0_0_2px_rgba(108,99,255,0.15)]"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3">
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
              className="px-5 py-2 bg-linear-to-r from-[#6c63ff] to-[#a78bfa] text-white text-sm font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(108,99,255,0.3)] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
