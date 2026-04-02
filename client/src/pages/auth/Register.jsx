import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineUser } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { BsLightningCharge } from "react-icons/bs";
import toast from "react-hot-toast";
import { registerUser } from "../../api/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
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
      // Backend expects: { name, email, password }
      const { data } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Check if backend returned "User already exists"
      if (data.message === "User already exists") {
        setError("An account with this email already exists");
        toast.error("Account already exists");
        return;
      }

      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
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
        <p>Create your account to get started</p>
      </div>

      {/* Error */}
      {error && <div className="form-error">{error}</div>}

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit}>
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
          {isLoading ? <span className="btn-spinner"></span> : "Create Account"}
        </button>
      </form>

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
