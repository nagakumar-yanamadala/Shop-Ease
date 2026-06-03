import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function RemoveCartItem({ productId, setInCart }) {
  const { setUser } = useContext(AuthContext);

  const toggleCart = async () => {
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
    } else {
      setInCart(false);
    }
    setUser(updatedUser);
  };

  return (
    <button
      className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 hover:border-red-200 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-medium tracking-wide py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none"
      onClick={toggleCart}
    >
      Remove
    </button>
  );
}