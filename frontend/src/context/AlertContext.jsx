import React, { createContext, useState, useContext } from "react";
import CustomAlert from "../components/CustomAlert"; // Adjust the path to your CustomAlert file

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Global function to trigger the alert from any component
  const showAlert = (type, title, message) => {
    setAlertConfig({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}

      {/* The Global Alert stays mounted right here at the root level */}
      <CustomAlert
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};

// Custom hook for seamless integration across your app
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
