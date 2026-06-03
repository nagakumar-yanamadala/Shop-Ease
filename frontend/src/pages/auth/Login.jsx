import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  // View States: 'login' | 'forgot-email' | 'forgot-otp'
  const [view, setView] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please enter both your email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      setUser(data.user);
      setSuccess("Successfully logged in! Redirecting...");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendForgotOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/forgot-password-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }

      setSuccess("OTP sent to your email!");
      setView("forgot-otp");
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotOtp || !newPassword) {
      setError("Please enter the OTP and your new password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotEmail,
            otp: forgotOtp,
            newPassword,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        return;
      }

      setSuccess("Password reset successfully! You can now login.");
      setForgotEmail("");
      setForgotOtp("");
      setNewPassword("");
      setTimeout(() => setView("login"), 2000);
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!user ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 grid lg:grid-cols-2">
            {/* LEFT SIDE - Material Solid Panel */}
            <div className="hidden lg:flex flex-col justify-between bg-blue-700 p-12 text-white">
              <div>
                <div className="mb-8 inline-flex items-center justify-center p-3 bg-blue-600 rounded-lg shadow-sm">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-medium leading-tight tracking-tight">
                  Welcome Back to
                  <br />
                  ShopEase
                </h1>
                <p className="mt-4 text-blue-100 text-base leading-relaxed max-w-md">
                  Manage your orders, explore trending products, and enjoy a
                  seamless shopping experience.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-blue-600">
                <div>
                  <h3 className="text-2xl font-bold">10K+</h3>
                  <p className="text-xs font-medium text-blue-200 uppercase tracking-wider mt-1">
                    Happy Customers
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">24/7</h3>
                  <p className="text-xs font-medium text-blue-200 uppercase tracking-wider mt-1">
                    Support Available
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Form */}
            <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
              <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-medium tracking-tight text-gray-900">
                    Shop<span className="text-blue-600">Ease</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {view === "login" &&
                      "Login to continue your shopping journey"}
                    {view === "forgot-email" &&
                      "Enter your email to reset password"}
                    {view === "forgot-otp" && "Verify OTP and set new password"}
                  </p>
                </div>

                {/* Alerts */}
                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
                    <XCircle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Error</p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">
                        Success
                      </p>
                      <p className="text-sm text-emerald-600">{success}</p>
                    </div>
                  </div>
                )}

                {/* --- VIEW: LOGIN --- */}
                {view === "login" && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span className="text-sm text-gray-600">
                          Remember me
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setView("forgot-email");
                          setError("");
                          setSuccess("");
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors focus:outline-none"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full text-white text-sm font-medium tracking-wide py-3 rounded-lg transition-colors shadow-sm focus:outline-none ${loading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </button>
                  </form>
                )}

                {/* --- VIEW: FORGOT PASSWORD (EMAIL) --- */}
                {view === "forgot-email" && (
                  <form onSubmit={handleSendForgotOTP} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Registered Email
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full text-white text-sm font-medium tracking-wide py-3 rounded-lg transition-colors shadow-sm focus:outline-none mt-2 ${loading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                      {loading ? "Sending OTP..." : "Send Verification OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setView("login");
                        setError("");
                        setSuccess("");
                      }}
                      className="w-full text-sm font-medium text-gray-500 hover:text-gray-900 py-2 transition-colors focus:outline-none mt-2"
                    >
                      Back to Login
                    </button>
                  </form>
                )}

                {/* --- VIEW: FORGOT PASSWORD (OTP & NEW PASS) --- */}
                {view === "forgot-otp" && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        placeholder="000000"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-center text-lg font-bold tracking-widest"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Create a new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full text-white text-sm font-medium tracking-wide py-3 rounded-lg transition-colors shadow-sm focus:outline-none mt-2 ${loading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setView("login");
                        setError("");
                        setSuccess("");
                      }}
                      className="w-full text-sm font-medium text-gray-500 hover:text-gray-900 py-2 transition-colors focus:outline-none mt-2"
                    >
                      Cancel & Back to Login
                    </button>
                  </form>
                )}

                {view === "login" && (
                  <p className="text-center text-sm text-gray-600 mt-8 pt-6 border-t border-gray-100">
                    Don't have an account?{" "}
                    <a
                      href="/signup"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Sign Up
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-10 max-w-sm w-full text-center border border-gray-200">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-2">
              Already Logged In
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              You are currently logged into your ShopEase account.
            </p>
            <a
              href="/"
              className="inline-flex w-full items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide px-6 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Go To Dashboard
            </a>
          </div>
        </div>
      )}
    </>
  );
}