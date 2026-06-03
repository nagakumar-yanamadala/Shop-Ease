import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CheckCircle2, XCircle } from "lucide-react";

const url = import.meta.env.VITE_API_URL;

export default function SignUp() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    loginType: "buyer",
    isUser: true,
    isSeller: false,
    otp: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };
  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "loginType") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        isUser: value === "buyer",
        isSeller: value === "seller",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
    setSuccess("");
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isPasswordValid) {
      setError("Please meet all password requirements.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${url}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.otp.length < 4) {
      setError("Please enter a valid OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${url}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setSuccess("Account created successfully!");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!user ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 grid lg:grid-cols-[1fr_400px] xl:grid-cols-2">
            {/* LEFT SIDE - Solid Material Panel */}
            <div className="hidden lg:flex flex-col justify-between bg-blue-700 p-12 text-white">
              <div className="max-w-md">
                <p className="uppercase tracking-[0.2em] text-blue-200 text-xs font-bold mb-4">
                  Welcome to
                </p>
                <h1 className="text-4xl font-medium tracking-tight leading-tight">
                  ShopEase Account Setup
                </h1>
                <p className="mt-6 text-base text-blue-100 leading-relaxed">
                  Create your account and experience a modern platform built for
                  seamless shopping and effortless selling.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-4 text-sm text-blue-100 font-medium">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-300" /> Fast
                  Setup
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-300" /> Secure
                </span>
              </div>
            </div>

            {/* RIGHT SIDE - Forms */}
            <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
              <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-medium tracking-tight text-gray-900">
                    {step === 1 ? "Create Account" : "OTP Verification"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {step === 1
                      ? "Join thousands of users on ShopEase."
                      : "Verify your email to continue."}
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
                        Status
                      </p>
                      <p className="text-sm text-emerald-600">{success}</p>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={step === 1 ? handleNextStep : handleSubmit}
                  className="space-y-5"
                >
                  {/* STEP 1: Details */}
                  {step === 1 && (
                    <>
                      {/* Account Type Selector (Material Segmented Buttons) */}
                      <div className="flex bg-gray-100 p-1 rounded-lg">
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="loginType"
                            value="buyer"
                            checked={formData.loginType === "buyer"}
                            onChange={handleInputChange}
                            className="peer sr-only"
                          />
                          <div className="text-center text-sm font-medium py-2 rounded-md transition-colors peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm text-gray-500">
                            Buyer
                          </div>
                        </label>
                        <label className="flex-1 cursor-pointer">
                          <input
                            type="radio"
                            name="loginType"
                            value="seller"
                            checked={formData.loginType === "seller"}
                            onChange={handleInputChange}
                            className="peer sr-only"
                          />
                          <div className="text-center text-sm font-medium py-2 rounded-md transition-colors peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm text-gray-500">
                            Seller
                          </div>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm mb-2"
                        />
                        {formData.password && (
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] uppercase font-bold tracking-wider">
                            <span
                              className={
                                passwordCriteria.length
                                  ? "text-emerald-600"
                                  : "text-gray-400"
                              }
                            >
                              ✓ 8+ chars
                            </span>
                            <span
                              className={
                                passwordCriteria.uppercase
                                  ? "text-emerald-600"
                                  : "text-gray-400"
                              }
                            >
                              ✓ Uppercase
                            </span>
                            <span
                              className={
                                passwordCriteria.number
                                  ? "text-emerald-600"
                                  : "text-gray-400"
                              }
                            >
                              ✓ Number
                            </span>
                            <span
                              className={
                                passwordCriteria.special
                                  ? "text-emerald-600"
                                  : "text-gray-400"
                              }
                            >
                              ✓ Special char
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-2 text-white text-sm font-medium tracking-wide py-3 rounded-lg transition-colors shadow-sm focus:outline-none ${loading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}`}
                      >
                        {loading ? "Sending OTP..." : "Continue"}
                      </button>
                    </>
                  )}

                  {/* STEP 2: OTP Validation */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-sm text-blue-900">
                          We've sent an OTP code to <br />
                          <span className="font-bold">{formData.email}</span>
                        </p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 text-center">
                          Enter 6-Digit OTP
                        </label>
                        <input
                          type="text"
                          name="otp"
                          placeholder="000000"
                          value={formData.otp}
                          onChange={handleInputChange}
                          maxLength={6}
                          className="w-full px-4 py-3 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-center text-2xl tracking-[0.5em] font-bold"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium tracking-wide hover:bg-gray-50 transition-colors focus:outline-none"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className={`flex-[2] text-white text-sm font-medium tracking-wide py-3 rounded-lg transition-colors shadow-sm focus:outline-none ${loading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                          {loading ? "Verifying..." : "Complete Sign Up"}
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <p className="text-center text-sm text-gray-600 mt-6 pt-6 border-t border-gray-100">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Sign In
                      </Link>
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-10 max-w-sm w-full text-center border border-gray-200">
            <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-2">
              Already Logged In
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              You are currently logged into an account.
            </p>
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide px-6 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
