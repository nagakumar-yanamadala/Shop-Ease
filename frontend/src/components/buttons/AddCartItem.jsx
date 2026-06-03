import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";

export default function AddCartItem({ productId, setInCart }) {
  const { user, setUser } = useContext(AuthContext);
  const { showAlert } = useAlert();

  const toggleCart = async () => {
    if (!user || user?.loginType === "seller") {
      showAlert(
        "info",
        "Buyer Account Required",
        "Please log in with a buyer account to add items to your cart.",
      );
      return;
    }
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/addtocart/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const data = await res.json();
    const updatedUser = data.user;
    console.log(updatedUser);
    if (updatedUser?.Cart?.includes(productId)) {
      setInCart(true);
    }
    setUser(updatedUser);
  };

  return (
    <button
      className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide py-2 px-4 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      onClick={toggleCart}
    >
      Add to Cart
    </button>
  );
}