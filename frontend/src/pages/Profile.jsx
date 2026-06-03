import { useContext, useState, useEffect } from "react";
import {
  Mail,
  ShieldCheck,
  User,
  Store,
  BadgeCheck,
  RefreshCcw,
  Edit3,
  X,
  Save,
  MapPin,
  Plus,
  Phone,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    line1: "",
    line2: "",
    phone: "",
  });

  const url = import.meta.env.VITE_API_URL;
  const currentMode = user?.loginType;

  useEffect(() => {
    if (user) {
      fetch(`${url}/address`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setAddresses(data.addresses || []);
        })
        .catch((err) => console.error("Error fetching addresses:", err));
    }
  }, [user, url]);

  if (!user) return null;

  const handleBecomeUser = async () => {
    try {
      const res = await fetch(`${url}/become-user`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBecomeSeller = async () => {
    try {
      const res = await fetch(`${url}/become-seller`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!editForm.firstName) {
      showAlert("error", "Validation Error", "First name is required.");
      return;
    }
    setIsUpdating(true);
    try {
      const res = await fetch(`${url}/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        showAlert(
          "success",
          "Profile Updated",
          "Your profile information has been saved successfully.",
        );
        setIsEditing(false);
      } else {
        showAlert(
          "error",
          "Update Failed",
          data.message || "Could not update profile details.",
        );
      }
    } catch (error) {
      showAlert("error", "Network Error", "Could not connect to the server.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddressChange = (e) =>
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.line1 || !addressForm.phone) {
      showAlert(
        "error",
        "Incomplete Form",
        "Please fill in all required address fields.",
      );
      return;
    }
    setIsSavingAddress(true);
    try {
      const res = await fetch(`${url}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(addressForm),
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
        setIsAddingAddress(false);
        setAddressForm({ name: "", line1: "", line2: "", phone: "" });
        showAlert(
          "success",
          "Address Saved",
          "Your new address has been added to your profile.",
        );
      } else {
        showAlert(
          "error",
          "Save Failed",
          data.message || "Failed to save address.",
        );
      }
    } catch (error) {
      showAlert("error", "Network Error", "Could not connect to the server.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const renderActionButton = () => {
    const btnBaseClass =
      "flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-medium text-sm tracking-wide text-white shadow-sm transition-colors focus:outline-none";
    if (user.isSeller && !user.isUser) {
      return (
        <button
          onClick={handleBecomeUser}
          className={`${btnBaseClass} bg-green-600 hover:bg-green-700`}
        >
          <User size={16} /> Become User
        </button>
      );
    }
    if (user.isUser && !user.isSeller) {
      return (
        <button
          onClick={handleBecomeSeller}
          className={`${btnBaseClass} bg-amber-600 hover:bg-amber-700`}
        >
          <Store size={16} /> Become Seller
        </button>
      );
    }
    if (user.isUser && user.isSeller) {
      if (currentMode === "seller") {
        return (
          <button
            onClick={handleBecomeUser}
            className={`${btnBaseClass} bg-green-600 hover:bg-green-700`}
          >
            <RefreshCcw size={16} /> Switch to User
          </button>
        );
      }
      return (
        <button
          onClick={handleBecomeSeller}
          className={`${btnBaseClass} bg-amber-600 hover:bg-amber-700`}
        >
          <RefreshCcw size={16} /> Switch to Seller
        </button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 flex justify-center">
      <div className="w-full max-w-6xl grid lg:grid-cols-[340px_1fr] bg-white rounded-xl shadow-md overflow-hidden">
        {/* LEFT SIDE - Static Theme Sidebar */}
        <div
          className={`p-8 text-white flex flex-col justify-between ${currentMode === "seller" ? "bg-blue-700" : "bg-green-700"}`}
        >
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2.5 backdrop-blur-sm">
                {currentMode === "seller" ? (
                  <Store size={24} />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">ShopEase</h2>
                <p className="text-xs uppercase tracking-wider text-white/80 mt-0.5">
                  {currentMode === "seller" ? "Seller Panel" : "User Panel"}
                </p>
              </div>
            </div>

            <h1 className="mb-4 text-3xl font-medium tracking-tight leading-snug">
              Welcome Back,
              <br />
              {user.firstName}
            </h1>
            <p className="text-sm leading-relaxed text-white/90">
              {currentMode === "seller"
                ? "Manage your products, track orders, and grow your business."
                : "Explore products, manage favourites, and enjoy shopping."}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {user.isUser && (
                <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                  Buyer Access
                </div>
              )}
              {user.isSeller && (
                <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                  Seller Access
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Profile Data & Forms */}
        <div className="p-6 sm:p-8 lg:p-10 border-l border-gray-200">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-900 tracking-tight">
                Profile Setup
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account information and preferences.
              </p>
            </div>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setEditForm({
                  firstName: user.firstName,
                  lastName: user.lastName,
                });
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium tracking-wide transition-colors focus:outline-none ${isEditing ? "border border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            >
              {isEditing ? (
                <>
                  <X size={16} /> Cancel
                </>
              ) : (
                <>
                  <Edit3 size={16} /> Edit Profile
                </>
              )}
            </button>
          </div>

          {/* General Profile Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-10">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <div
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-medium text-white shadow-sm ${currentMode === "seller" ? "bg-blue-600" : "bg-green-600"}`}
              >
                {(user?.firstName?.[0] || "").toUpperCase()}
                {(user?.lastName?.[0] || "").toUpperCase()}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={isUpdating}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium tracking-wide transition-colors focus:outline-none"
                    >
                      <Save size={16} />{" "}
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    {user.isUser && (
                      <div className="flex items-center gap-1 rounded bg-green-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-green-700 uppercase">
                        <User size={12} /> Buyer
                      </div>
                    )}
                    {user.isSeller && (
                      <div className="flex items-center gap-1 rounded bg-blue-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-blue-700 uppercase">
                        <BadgeCheck size={12} /> Seller
                      </div>
                    )}
                  </div>
                )}
                {!isEditing && (
                  <p className="mt-1 text-sm text-gray-500">
                    Active Mode:{" "}
                    <span className="font-medium capitalize text-gray-900">
                      {currentMode}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email Address
                  </h4>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-gray-100 p-2.5 text-gray-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Account Tier
                  </h4>
                  <p className="text-sm font-medium text-gray-900 mt-0.5 capitalize">
                    {user.loginType}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3 sm:flex-row">
              {renderActionButton()}
            </div>
          </div>

          {/* ADDRESS BOOK */}
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-medium tracking-tight text-gray-900 flex items-center gap-2">
                <MapPin className="text-gray-400" size={20} /> Saved Addresses
              </h3>
              {!isAddingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors focus:outline-none"
                >
                  <Plus size={16} /> Add Address
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {addresses.length === 0 && !isAddingAddress && (
                <div className="col-span-full border border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 text-center text-sm text-gray-500">
                  No addresses saved yet. Add one for faster checkouts.
                </div>
              )}
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {addr.name}
                    </h4>
                    <span className="bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium">
                      Saved
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {addr.line1}
                  </p>
                  {addr.line2 && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {addr.line2}
                    </p>
                  )}
                  <p className="text-xs text-gray-900 mt-3 font-medium flex items-center gap-1.5 pt-3 border-t border-gray-100">
                    <Phone size={14} className="text-gray-400" /> {addr.phone}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Address Form Widget */}
            {isAddingAddress && (
              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
                <div className="flex justify-between items-center mb-5">
                  <h4 className="font-medium text-gray-900 text-base">
                    New Delivery Address
                  </h4>
                  <button
                    onClick={() => setIsAddingAddress(false)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={addressForm.name}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                      House no., Building, Company
                    </label>
                    <input
                      type="text"
                      name="line1"
                      value={addressForm.line1}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                      Area, Street, City, State, PIN
                    </label>
                    <input
                      type="text"
                      name="line2"
                      value={addressForm.line2}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                    />
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={isSavingAddress}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium tracking-wide transition-colors focus:outline-none"
                    >
                      {isSavingAddress ? "Saving..." : "Save Address"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;