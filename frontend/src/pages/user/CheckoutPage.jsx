import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";

const url = import.meta.env.VITE_API_URL;

const CheckoutPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [productsList, setProductsList] = useState([]);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    name: "",
    line1: "",
    line2: "",
    phone: "",
  });

  useEffect(() => {
    fetch(`${url}/products`)
      .then((res) => res.json())
      .then((data) => setProductsList(data));
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${url}/address`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.addresses?.length > 0) {
            setAddresses(data.addresses);
            setSelectedAddress(data.addresses[data.addresses.length - 1]._id);
          } else {
            setIsAddingAddress(true);
          }
        })
        .catch((err) => console.error("Error fetching addresses:", err));
    }
  }, [user]);

  const product = productsList.find(
    (productItem) => productItem?._id.toString() === params.id.toString(),
  );

  if (!product) return null;

  const productPrice = parseFloat(product.price);
  const deliveryFee = 40.0;
  const orderTotal = productPrice;

  const handleContinue = (e) => {
    e.preventDefault();
    if (!selectedAddress && addresses.length === 0) {
      showAlert(
        "error",
        "Address Required",
        "Please add and select a delivery address.",
      );
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setCurrentStep(1);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async () => {
    if (
      !newAddressForm.name ||
      !newAddressForm.line1 ||
      !newAddressForm.phone
    ) {
      showAlert(
        "error",
        "Incomplete Form",
        "Please fill in all the required address fields.",
      );
      return;
    }
    setIsSavingAddress(true);
    try {
      const response = await fetch(`${url}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newAddressForm),
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
        setSelectedAddress(data.addresses[data.addresses.length - 1]._id);
        setIsAddingAddress(false);
        setNewAddressForm({ name: "", line1: "", line2: "", phone: "" });
        showAlert(
          "success",
          "Address Saved",
          "Your new delivery address has been saved.",
        );
      } else {
        showAlert(
          "error",
          "Failed to Save",
          data.message || "Could not save address.",
        );
      }
    } catch (error) {
      showAlert("error", "Network Error", "Could not connect to the server.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      showAlert(
        "info",
        "Login Required",
        "Please log in to your account first.",
      );
      return;
    }

    setIsProcessing(true);
    const chosenAddress = addresses.find((a) => a._id === selectedAddress);

    if (!chosenAddress) {
      showAlert("error", "Address Error", "Selected address is invalid.");
      setIsProcessing(false);
      return;
    }

    const paymentMap = {
      card: "Credit/Debit Card",
      upi: "UPI",
      cod: "Cash on Delivery",
    };
    const line2Parts = chosenAddress.line2.split(",");
    const cleanSellerId = product.hostId?._id || product.hostId;

    const orderPayload = {
      buyerId: user._id,
      sellerId: cleanSellerId,
      items: [
        {
          productId: product._id,
          quantity: 1,
          priceAtPurchase: Number(product.price) || 0,
        },
      ],
      shippingAddress: {
        fullName: chosenAddress.name,
        addressLine1: chosenAddress.line1,
        addressLine2: chosenAddress.line2,
        city: line2Parts[0]?.trim() || "Unknown City",
        state: line2Parts[1]?.trim() || "Unknown State",
        postalCode: line2Parts[2]?.trim() || "000000",
        phone: chosenAddress.phone,
      },
      totalAmount: Number(orderTotal) || 0,
      shippingFee: Number(deliveryFee) || 0,
      paymentMethod: paymentMap[selectedPayment] || "Credit/Debit Card",
    };

    try {
      const response = await fetch(`${url}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderPayload),
      });
      const data = await response.json();
      if (response.ok) {
        showAlert(
          "success",
          "Order Placed!",
          "Your order was successfully placed.",
        );
        navigate("/track-order");
      } else {
        showAlert(
          "error",
          "Checkout Failed",
          `${data.message} ${data.error ? `(${data.error})` : ""}`,
        );
        setIsProcessing(false);
      }
    } catch (error) {
      showAlert("error", "Connection Error", "An internal error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-50 flex justify-center p-4 lg:p-8 font-sans text-gray-900 min-h-screen">
      <div className="bg-white max-w-6xl w-full rounded-xl shadow-md flex flex-col-reverse lg:flex-row overflow-hidden border border-gray-200">
        {/* Left Side - Checkout Wizard */}
        <div className="p-6 md:p-10 lg:w-2/3 bg-white overflow-y-auto">
          <div className="mb-8 border-b border-gray-200 pb-5">
            <h2 className="text-2xl font-medium text-gray-900 tracking-tight mb-6">
              Checkout
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span
                    className={
                      currentStep >= 1 ? "text-blue-600" : "text-gray-400"
                    }
                  >
                    1. Address
                  </span>
                  <span
                    className={
                      currentStep >= 2 ? "text-blue-600" : "text-gray-400"
                    }
                  >
                    2. Payment
                  </span>
                </div>
                <div className="flex gap-2">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors ${currentStep >= 1 ? "bg-blue-600" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-colors ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* STAGE 1: DELIVERY ADDRESS */}
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Select a delivery address
                </h3>

                {isAddingAddress ? (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Add a new address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newAddressForm.name}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={newAddressForm.phone}
                          onChange={handleFormChange}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                        Flat, House no., Building
                      </label>
                      <input
                        type="text"
                        name="line1"
                        value={newAddressForm.line1}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">
                        Area, City, State, PIN
                      </label>
                      <input
                        type="text"
                        name="line2"
                        value={newAddressForm.line2}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-400 focus:outline-none focus:ring-1 focus:border-blue-600 focus:ring-blue-600 text-sm"
                      />
                    </div>
                    <div className="flex gap-3 mt-4 pt-4">
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        disabled={isSavingAddress}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide rounded-lg transition-colors shadow-sm focus:outline-none"
                      >
                        {isSavingAddress ? "Saving..." : "Use this address"}
                      </button>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(false)}
                          className="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm font-medium tracking-wide rounded-lg transition-colors focus:outline-none"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Saved addresses ({addresses.length})
                    </p>
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <label
                          key={address._id}
                          className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedAddress === address._id ? "border-blue-500 bg-blue-50/50" : "border-gray-300 hover:border-gray-400"}`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddress === address._id}
                            onChange={() => setSelectedAddress(address._id)}
                            className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer"
                          />
                          <div>
                            <p className="font-medium text-gray-900 text-sm mb-1">
                              {address.name}
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {address.line1}, {address.line2}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              Phone: {address.phone}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(true)}
                      className="mt-4 text-blue-600 font-medium text-sm flex items-center gap-1.5 hover:underline focus:outline-none"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add a new delivery address
                    </button>
                  </>
                )}
              </div>
            )}

            {/* STAGE 2: PAYMENT METHOD */}
            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <button
                    onClick={handleBack}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500 focus:outline-none"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>
                  Payment method
                </h3>

                <div className="space-y-3">
                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${selectedPayment === "card" ? "border-blue-500 bg-blue-50/50" : "border-gray-300 hover:border-gray-400"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === "card"}
                        onChange={() => setSelectedPayment("card")}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                      <span className="font-medium text-gray-900 text-sm">
                        Credit or debit card
                      </span>
                    </div>
                  </label>

                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${selectedPayment === "upi" ? "border-blue-500 bg-blue-50/50" : "border-gray-300 hover:border-gray-400"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === "upi"}
                        onChange={() => setSelectedPayment("upi")}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                      <span className="font-medium text-gray-900 text-sm">
                        UPI (Google Pay, PhonePe, Paytm)
                      </span>
                    </div>
                  </label>

                  <label
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${selectedPayment === "cod" ? "border-blue-500 bg-blue-50/50" : "border-gray-300 hover:border-gray-400"}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === "cod"}
                        onChange={() => setSelectedPayment("cod")}
                        className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                      <div>
                        <span className="font-medium text-gray-900 text-sm block mb-1">
                          Cash on Delivery
                        </span>
                        <span className="text-xs text-gray-500">
                          Pay at your doorstep.
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Mobile-only Submit Buttons */}
            <div className="lg:hidden mt-6 pt-4 border-t border-gray-200">
              {currentStep === 1 ? (
                <button
                  onClick={handleContinue}
                  disabled={isAddingAddress || addresses.length === 0}
                  className={`w-full text-sm font-medium tracking-wide py-3 px-4 rounded-lg transition-colors shadow-sm focus:outline-none ${isAddingAddress || addresses.length === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  Continue to Payment
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full text-sm font-medium tracking-wide py-3 px-4 rounded-lg transition-colors shadow-sm focus:outline-none ${isProcessing ? "bg-gray-300 text-gray-600 cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Pay Now • ₹${orderTotal.toLocaleString("en-IN")}`}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div className="bg-gray-50 p-6 md:p-10 lg:w-1/3 flex flex-col justify-start border-b lg:border-b-0 lg:border-l border-gray-200">
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Order Summary
            </h3>

            {/* Product Details */}
            <div className="flex gap-4 items-start pb-6 mb-6 border-b border-gray-200">
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200 p-1">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-900 leading-snug mb-1">
                  {product.title}
                </h4>
                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">
                  {product.category}
                </div>
                <div className="font-medium text-sm text-gray-900">
                  ₹{parseFloat(product.price).toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Items:</span>
                <span>₹{productPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Delivery:</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 text-sm font-medium">
                <span>FREE Delivery:</span>
                <span>-₹{deliveryFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-between items-center mb-8">
              <span className="text-base font-medium text-gray-900">
                Order Total
              </span>
              <span className="text-xl font-bold text-gray-900">
                ₹{orderTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:block">
              {currentStep === 1 ? (
                <button
                  onClick={handleContinue}
                  disabled={isAddingAddress || addresses.length === 0}
                  className={`w-full text-sm font-medium tracking-wide py-3 px-4 rounded-lg transition-colors shadow-sm focus:outline-none ${isAddingAddress || addresses.length === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  Continue to Payment
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full text-sm font-medium tracking-wide py-3 px-4 rounded-lg transition-colors shadow-sm focus:outline-none ${isProcessing ? "bg-gray-300 text-gray-600 cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              By placing your order, you agree to ShopEase's privacy notice and
              conditions of use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
