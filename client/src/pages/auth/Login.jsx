import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { BsLightningCharge, BsGoogle } from "react-icons/bs";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { loginUser, googleAuth } from "../../api/authApi";
import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await loginUser(formData);

      // Store auth data (matches backend response: { user, accessToken, refreshToken })
      setAuth(data.user, data.accessToken, data.refreshToken);

      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const { data } = await googleAuth(credentialResponse.credential);
      setAuth(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {/* Brand */}
      <div className="auth-brand">
        <div className="auth-brand-icon">
          <BsLightningCharge color="white" />
        </div>
        <h1>DevFlow</h1>
        <p>Sign in to your workspace</p>
      </div>

      {/* Error */}
      {error && <div className="form-error">{error}</div>}

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <div className="input-wrapper">
            <HiOutlineMail className="input-icon" />
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <RiLockPasswordLine className="input-icon" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={isLoading}
        >
          {isLoading ? <span className="btn-spinner"></span> : "Sign In"}
        </button>

        <div className="relative flex items-center py-4 my-2">
          <div className="grow border-t border-white/10"></div>
          <span className="shrink-0 mx-4 text-[#64748b] text-sm">or</span>
          <div className="grow border-t border-white/10"></div>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error("Google Login Failed");
            }}
            theme="filled_black"
            shape="rectangular"
            text="signin_with"
            width="320"
          />
        </div>
      </form>

      {/* Footer */}
      <div className="auth-footer">
        <p>
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
