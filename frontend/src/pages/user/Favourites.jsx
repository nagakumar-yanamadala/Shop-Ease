import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserOnly from "./UserOnly";
import ProductItem from "../../components/ProductItem";
import { Heart, Sparkles } from "lucide-react";

export default function Favourites() {
  const { user, loading } = useContext(AuthContext);
  const [favouriteProducts, setFavouriteProducts] = useState([]);

  useEffect(() => {
    const getFavourites = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/favourites`, {
          credentials: "include",
        });
        const data = await res.json();
        setFavouriteProducts(data.favourites);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getFavourites();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500 animate-pulse flex items-center gap-2">
          <Heart size={20} className="animate-pulse" fill="currentColor" />{" "}
          Loading Favourites...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user?.loginType === "buyer" ? (
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {/* Page Header */}
          <div className="mb-8 border-b border-gray-200 pb-5 flex items-center gap-4">
            <div className="bg-red-50 p-2.5 rounded-lg text-red-600 shadow-sm">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-gray-900 tracking-tight">
                Saved Favourites
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Products you love and want to keep an eye on
              </p>
            </div>
          </div>

          {/* Empty State vs Grid */}
          {favouriteProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200 flex flex-col items-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mb-5">
                <Heart size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No favourites saved yet
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Tap the heart icon on any product to save it here for later.
              </p>
              <a
                href="/"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide py-2.5 px-6 rounded-lg transition-colors focus:outline-none shadow-sm"
              >
                Discover Products <Sparkles size={16} />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favouriteProducts.map((product) => (
                <ProductItem key={product._id} product={product} />
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