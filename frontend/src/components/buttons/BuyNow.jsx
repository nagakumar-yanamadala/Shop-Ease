import { useContext } from "react";
import { useAlert } from "../../context/AlertContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function BuyNow({ productId }) {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user } = useContext(AuthContext);

  const handleBuyNow = () => {
    if (!user || user?.loginType === "seller") {
      showAlert(
        "info",
        "Buyer Account Required",
        "Please log in with a buyer account to buy products.",
      );
      return;
    } else {
      navigate(`/checkout/${productId}`);
    }
  };

  return (
    <button
      className="hidden lg:flex w-full justify-center items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium tracking-wide py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none"
      onClick={handleBuyNow}
    >
      Buy Now
    </button>
  );
}