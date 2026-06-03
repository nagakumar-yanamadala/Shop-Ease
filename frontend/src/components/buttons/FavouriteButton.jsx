import { useContext, useState } from "react";
import { Heart } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function FavouriteButton({ productId }) {
  const { user, setUser } = useContext(AuthContext);
  const [isFavourite, setIsFavourite] = useState(false);

  const initialInFavourite =
    user?.favourites?.some((id) => id.toString() === productId) || false;

  const handleLike = async () => {
    //post favourite to backend
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/favourites/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    //get backend data (session , isFavourite)
    const data = await res.json();
    //update frontend session
    setUser(data.user);
    // update favourite state
    setIsFavourite(data.isFavourite);
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center justify-center p-2 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 focus:outline-none"
      aria-label="Add to favourites"
    >
      <Heart
        size={20}
        className={`transition-colors duration-200 ${
          isFavourite || initialInFavourite
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-gray-600"
        }`}
      />
    </button>
  );
}