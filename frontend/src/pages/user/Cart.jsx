import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserOnly from "./UserOnly";
import ProductItem from "../../components/ProductItem";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function Cart() {
  const { user, loading } = useContext(AuthContext);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
          credentials: "include",
        });

        const data = await res.json();

        console.log("Cart API Response:", data);

        setCartProducts(Array.isArray(data.cart) ? data.cart : []);
      } catch (error) {
        console.error("Cart Fetch Error:", error);
        setCartProducts([]);
      }
    };

    if (user) {
      getCartItems();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500 animate-pulse flex items-center gap-2">
          <ShoppingCart size={20} className="animate-bounce" />
          Loading Cart...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.loginType === "buyer" ? (
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="mb-8 border-b border-gray-200 pb-5 flex items-center gap-4">
            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 shadow-sm">
              <ShoppingCart size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-medium text-gray-900 tracking-tight">
                My Cart
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                Review and manage your selected items
              </p>
            </div>
          </div>

          {cartProducts?.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200 flex flex-col items-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mb-5">
                <ShoppingCart size={32} className="text-gray-400" />
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is feeling lonely
              </h3>

              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Browse our categories and discover our best deals to add items
                to your cart.
              </p>

              <a
                href="/"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide py-2.5 px-6 rounded-lg transition-colors focus:outline-none shadow-sm"
              >
                Start Shopping
                <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(cartProducts || []).map((product) => (
                <ProductItem
                  key={product?._id || Math.random()}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <UserOnly />
      )}
    </div>
  );
}
