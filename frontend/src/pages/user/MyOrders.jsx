import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  XCircle,
} from "lucide-react";

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState(null);

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user?._id) {
      fetch(`${url}/orders/buyer/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            setOrders([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch orders:", err);
          setLoading(false);
        });
    }
  }, [user?._id, url]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Out for Delivery":
      case "Out For Delivery":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Pending":
      case "Processing":
      case "Packed":
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const generateTracking = (currentStatus, orderDate) => {
    const defaultSteps = [
      {
        title: "Order Placed",
        time: new Date(orderDate).toLocaleDateString(),
        completed: true,
        icon: Package,
      },
      { title: "Processing", time: "Pending", completed: false, icon: Package },
      { title: "Shipped", time: "Pending", completed: false, icon: Truck },
      {
        title: "Out For Delivery",
        time: "Pending",
        completed: false,
        icon: Truck,
      },
      {
        title: "Delivered",
        time: "Pending",
        completed: false,
        icon: CheckCircle2,
      },
    ];

    if (currentStatus === "Cancelled") {
      return [
        {
          title: "Order Placed",
          time: new Date(orderDate).toLocaleDateString(),
          completed: true,
          icon: Package,
        },
        {
          title: "Cancelled",
          time: "Order Cancelled",
          completed: true,
          current: true,
          icon: XCircle,
        },
      ];
    }

    const statuses = [
      "Pending",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];
    const currentIndex = statuses.indexOf(currentStatus);

    return defaultSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex || (index === 0 && currentIndex === -1),
      current:
        index === currentIndex || (index === 0 && currentStatus === "Pending"),
      time: index <= currentIndex ? "Completed" : "Pending",
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500 animate-pulse flex items-center gap-2">
          <Package size={20} className="animate-bounce" /> Loading Orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 w-full">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 shadow-sm">
                <Package size={24} />
              </div>
              <div>
                <h1 className="text-xl font-medium tracking-tight text-gray-900">
                  My Orders
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Track and manage your purchases
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="w-full md:w-80">
              <div className="flex items-center bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
                <div className="pl-3 text-gray-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full px-3 py-2 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center">
            <Package size={40} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No orders found
            </h3>
            <p className="text-sm text-gray-500">
              You haven't placed any orders yet.
            </p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-5">
          {orders.map((order, index) => {
            const orderId = order._id.slice(-6).toUpperCase();
            const orderDate = new Date(
              order.createdAt || order.dateOfOrder,
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const totalAmount = order.totalAmount
              ? `₹${order.totalAmount.toLocaleString("en-IN")}`
              : "₹0";
            const mainProduct = order.items?.[0]?.productId;
            const remainingItems =
              order.items?.length > 1
                ? ` + ${order.items.length - 1} more items`
                : "";
            const trackingTimeline = generateTracking(
              order.orderStatus || "Pending",
              order.dateOfOrder || order.createdAt,
            );

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                    {/* Image */}
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-center shrink-0 border border-gray-200">
                      <img
                        src={
                          mainProduct?.image ||
                          "https://via.placeholder.com/150"
                        }
                        alt={mainProduct?.title || "Product"}
                        className="w-24 h-24 object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-300 uppercase tracking-wider">
                            #{orderId}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(order.orderStatus || "Pending")}`}
                          >
                            {order.orderStatus || "Pending"}
                          </span>
                        </div>

                        <h2 className="text-base font-medium text-gray-900 leading-snug">
                          {mainProduct?.title || "Product details unavailable"}{" "}
                          <span className="text-sm font-normal text-gray-500">
                            {remainingItems}
                          </span>
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock3 size={14} className="text-gray-400" />
                            <span>{orderDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-400" />
                            <span>
                              {order.shippingAddress?.city ||
                                "Address not provided"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions & Price */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-colors focus:outline-none">
                            Invoice
                          </button>
                          <button
                            onClick={() =>
                              setOpenOrder(openOrder === index ? null : index)
                            }
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-colors flex items-center gap-1.5 focus:outline-none"
                          >
                            {openOrder === index ? (
                              <>
                                Hide Tracking <ChevronUp size={16} />
                              </>
                            ) : (
                              <>
                                Track Order <ChevronDown size={16} />
                              </>
                            )}
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                            Order Total
                          </p>
                          <h3 className="text-lg font-bold text-gray-900">
                            {totalAmount}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                {openOrder === index && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6 sm:p-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wider">
                      Tracking Timeline
                    </h3>
                    <div className="relative pl-2">
                      {trackingTimeline.map((step, i) => {
                        const Icon = step.icon;
                        const isLast = i === trackingTimeline.length - 1;

                        return (
                          <div
                            key={i}
                            className="flex gap-4 relative pb-8 last:pb-0"
                          >
                            {/* Connecting Line */}
                            {!isLast && (
                              <div
                                className={`absolute left-[15px] top-8 w-0.5 h-full -ml-[1px] ${step.completed ? "bg-blue-600" : "bg-gray-300"}`}
                              />
                            )}

                            {/* Status Icon */}
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 border-2 ${step.completed ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-400"}`}
                            >
                              <Icon size={14} strokeWidth={2.5} />
                            </div>

                            {/* Status Content */}
                            <div className="flex-1 pt-1.5">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div>
                                  <h4
                                    className={`text-sm font-medium ${step.current ? "text-blue-600" : "text-gray-900"}`}
                                  >
                                    {step.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {step.time}
                                  </p>
                                </div>
                                {step.current && (
                                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-200 self-start sm:self-auto">
                                    Current Status
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}