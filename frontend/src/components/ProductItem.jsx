import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import FavouriteButton from "./buttons/FavouriteButton";
import RemoveCartItem from "./buttons/RemoveCartItem";
import AddCartItem from "./buttons/AddCartItem";
import BuyNow from "./buttons/BuyNow";

const ProductItem = ({ product }) => {
  const { user, loading } = useContext(AuthContext);
  const [inCart, setInCart] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  const initialInCart =
    user?.Cart?.some((id) => id.toString() === product._id) || false;

  return (
    <div className="relative flex flex-col w-full max-w-sm bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Image Section */}
      {/* Image Section */}
      <div className="relative w-full h-64 bg-gray-50 overflow-hidden">
        {/* Favourite Button */}
        {user?.loginType !== "seller" && (
          <div className="absolute top-3 right-3 z-10">
            <FavouriteButton productId={product._id} />
          </div>
        )}

        {/* Product Tag */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm z-10">
            {product.tag}
          </div>
        )}

        {/* Product Image */}
        <a href={`/details/${product._id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </a>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + Rating */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-semibold text-blue-600 tracking-wider uppercase">
            {product.category}
          </span>

          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
            <svg
              className="w-3.5 h-3.5 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            <span className="ml-1 text-xs font-medium text-gray-700">
              {product.rating || 0}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[56px]">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-3 mb-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price}
          </span>

          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.oldPrice}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
          <div className="flex-1">
            {!inCart && !initialInCart ? (
              <AddCartItem productId={product._id} setInCart={setInCart} />
            ) : (
              <RemoveCartItem productId={product._id} setInCart={setInCart} />
            )}
          </div>

          <div className="flex-1">
            <BuyNow productId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
