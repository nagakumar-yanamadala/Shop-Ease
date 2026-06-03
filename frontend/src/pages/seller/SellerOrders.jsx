import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Package,
  TrendingUp,
  Clock,
  MapPin,
  CreditCard,
  User,
} from "lucide-react";
import SellerOnly from "./SellerOnly";

export default function SellerOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user?._id && user?.loginType === "seller") {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${url}/orders/seller/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (error) {
      console.error("Failed to fetch seller orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${url}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (res.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? { ...order, orderStatus: newStatus }
              : order,
          ),
        );
      } else {
        alert("Failed to update order status.");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-emerald-700 bg-emerald-50";
      case "Shipped":
      case "Out for Delivery":
        return "text-blue-700 bg-blue-50";
      case "Processing":
      case "Packed":
        return "text-amber-700 bg-amber-50";
      case "Cancelled":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) =>
    ["Pending", "Processing", "Packed"].includes(o.orderStatus),
  ).length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0,
  );

  if (user?.loginType !== "seller") {
    return <SellerOnly />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-500 font-medium">
          <Package size={32} className="animate-pulse" />
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER & METRICS */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight mb-6 text-gray-900 flex items-center gap-2">
            <Package size={24} className="text-blue-600" />
            Order Management
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                <Package size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total Orders
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  {totalOrders}
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Action Required
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  {pendingOrders}
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Total Revenue
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER LIST */}
        <div className="space-y-5">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No orders yet
              </h3>
              <p className="text-sm text-gray-500">
                When customers buy your products, they will appear here.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const orderId = order._id.slice(-6).toUpperCase();
              const mainProduct = order.items?.[0]?.productId;
              const dateObj = new Date(order.dateOfOrder || order.createdAt);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-gray-700">
                        #{orderId}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Clock size={14} />
                        {dateObj.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Status:
                      </span>
                      <select
                        value={order.orderStatus || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={updatingId === order._id}
                        className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-300 outline-none cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${getStatusColor(order.orderStatus)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1 */}
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 border border-gray-200 shrink-0">
                        <img
                          src={
                            mainProduct?.image ||
                            "https://via.placeholder.com/150"
                          }
                          alt={mainProduct?.title}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                          Product
                        </p>
                        <h4 className="font-medium text-gray-900 text-sm leading-snug mb-1">
                          {mainProduct?.title || "Unknown Product"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Qty: {order.items?.[0]?.quantity || 1}
                        </p>
                        {order.items?.length > 1 && (
                          <p className="text-[10px] font-medium text-blue-700 mt-2 bg-blue-50 px-2 py-0.5 rounded inline-block">
                            + {order.items.length - 1} other items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="border-l-0 lg:border-l border-gray-200 pl-0 lg:pl-6 pt-4 lg:pt-0 border-t lg:border-t-0">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <User size={12} /> Customer
                      </p>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {order.shippingAddress?.fullName}
                      </h4>
                      <p className="text-xs text-gray-600 flex items-start gap-1.5 mt-1">
                        <MapPin
                          size={14}
                          className="shrink-0 text-gray-400 mt-0.5"
                        />
                        <span>
                          {order.shippingAddress?.addressLine1},{" "}
                          {order.shippingAddress?.addressLine2 &&
                            `${order.shippingAddress.addressLine2},`}
                          <br />
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}{" "}
                          {order.shippingAddress?.postalCode}
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1.5 pl-5">
                        Phone: {order.shippingAddress?.phone}
                      </p>
                    </div>

                    {/* Column 3 */}
                    <div className="border-l-0 lg:border-l border-gray-200 pl-0 lg:pl-6 pt-4 lg:pt-0 border-t lg:border-t-0 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CreditCard size={12} /> Payment
                        </p>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="text-gray-500">Method:</span>
                          <span className="font-medium text-gray-900">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Status:</span>
                          <span
                            className={`font-medium ${order.paymentStatus === "Completed" ? "text-emerald-600" : "text-amber-600"}`}
                          >
                            {order.paymentStatus || "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-end">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                          Earnings
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
