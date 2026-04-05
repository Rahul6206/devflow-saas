import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineUser } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { BsLightningCharge, BsGoogle } from "react-icons/bs";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { registerUser, googleAuth, sendOtp } from "../../api/authApi";
import useAuthStore from "../../store/authStore";

const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await sendOtp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (data.message === "User already exists") {
        setError("An account with this email already exists");
        toast.error("Account already exists");
        return;
      }

      toast.success("Verification code sent to your email!");
      setStep(2); // Move to OTP step
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp,
      });

      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Verification failed. Please try again.";
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
      toast.error("Google sign in failed. Please try again.");
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
        <p>{step === 1 ? "Create your account to get started" : "Verify your email address"}</p>
      </div>

      {/* Error */}
      {error && <div className="form-error">{error}</div>}

      {/* Form Step 1: User Details */}
      {step === 1 && (
        <form className="auth-form" onSubmit={handleSendOtp}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <div className="input-wrapper">
              <HiOutlineUser className="input-icon" />
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="input-wrapper">
              <RiLockPasswordLine className="input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className="form-input"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
              >
                {showConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? <span className="btn-spinner"></span> : "Continue"}
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
                toast.error("Google Signup Failed");
              }}
              theme="filled_black"
              shape="rectangular"
              text="signup_with"
              width="320"
            />
          </div>
        </form>
      )}

      {/* Form Step 2: OTP Verification */}
      {step === 2 && (
        <form className="auth-form" onSubmit={handleVerifyOtp}>
          <div className="text-center text-[#94a3b8] mb-6 text-sm">
            We sent a 6-digit code to <strong>{formData.email}</strong>. Please enter it below.
          </div>
          
          <div className="form-group">
            <label htmlFor="otp">Verification Code</label>
            <div className="input-wrapper">
              <RiLockPasswordLine className="input-icon" />
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength="6"
                className="form-input text-center tracking-widest text-lg font-bold"
                placeholder="------"
                value={formData.otp}
                onChange={handleChange}
                autoComplete="one-time-code"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? <span className="btn-spinner"></span> : "Create Account"}
          </button>
          
          <button
            type="button"
            className="btn w-full mt-4 bg-transparent border border-white/10 text-white hover:bg-white/5"
            onClick={() => setStep(1)}
            disabled={isLoading}
          >
            Back
          </button>
        </form>
      )}

      {/* Footer */}
      <div className="auth-footer">
        <p>
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
