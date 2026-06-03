import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserOnly from "./UserOnly";
import MyOrders from "./MyOrders";

export default function TrackOrder() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return <div>{user?.loginType === "buyer" ? <MyOrders /> : <UserOnly />}</div>;
}
