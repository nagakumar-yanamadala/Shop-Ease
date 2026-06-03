import { useEffect } from "react";

const CustomAlert = ({ isOpen, onClose, type = "info", title, message }) => {
  // Automatically close alert on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Material UI inspired configuration for different alert types
  const typeConfig = {
    success: {
      iconColor: "text-green-600",
      buttonBg: "text-green-600 hover:bg-green-50", // Text button style
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    error: {
      iconColor: "text-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700 text-white shadow-sm", // Contained button style for emphasis
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    info: {
      iconColor: "text-blue-600",
      buttonBg: "text-blue-600 hover:bg-blue-50", // Text button style
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
      {/* Material Scrim (Backdrop) */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Material Alert Dialog */}
      <div className="relative max-w-sm w-full bg-white rounded-xl shadow-lg text-left transform transition-all animate-scale-in flex flex-col">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4 mb-4">
            {/* Status Icon */}
            <div className={`${config.iconColor}`}>{config.icon}</div>

            {/* Title */}
            <h3 className="text-xl font-medium text-gray-900">{title}</h3>
          </div>

          {/* Text Content */}
          <p className="text-gray-600 text-base leading-relaxed pl-12">
            {message}
          </p>
        </div>

        {/* Actions (Material Dialog standard spacing) */}
        <div className="p-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded text-sm font-medium uppercase tracking-wider transition-colors ${config.buttonBg}`}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;