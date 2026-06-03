import useEmblaCarousel from "embla-carousel-react";
import {
  FiWatch,
  FiHeadphones,
  FiTag,
  FiCamera,
  FiBriefcase,
  FiSmartphone,
  FiHome,
  FiShoppingBag,
  FiMonitor,
  FiCpu,
  FiBluetooth,
  FiCompass,
  FiSmile,
  FiGift,
  FiBookOpen,
  FiTruck,
  FiHeart,
  FiBox,
  FiShoppingCart,
  FiPaperclip,
  FiTool,
} from "react-icons/fi";

const categories = [
  { name: "Smart Watch", icon: <FiWatch /> },
  { name: "Audio", icon: <FiHeadphones /> },
  { name: "Shoes", icon: <FiTag /> },
  { name: "Camera", icon: <FiCamera /> },
  { name: "Accessories", icon: <FiBriefcase /> },
  { name: "Mobile", icon: <FiSmartphone /> },
  { name: "Home", icon: <FiHome /> },
  { name: "Fashion", icon: <FiShoppingBag /> },
  { name: "Computer", icon: <FiMonitor /> },
  { name: "Electronics", icon: <FiCpu /> },
  { name: "Wearables", icon: <FiBluetooth /> },
  { name: "Sports & Outdoors", icon: <FiCompass /> },
  { name: "Beauty & Personal Care", icon: <FiSmile /> },
  { name: "Toys & Games", icon: <FiGift /> },
  { name: "Books", icon: <FiBookOpen /> },
  { name: "Automotive", icon: <FiTruck /> },
  { name: "Health & Wellness", icon: <FiHeart /> },
  { name: "Pet Supplies", icon: <FiBox /> },
  { name: "Grocery & Gourmet Food", icon: <FiShoppingCart /> },
  { name: "Office Products", icon: <FiPaperclip /> },
  { name: "Tools & Home Improvement", icon: <FiTool /> },
];

export default function Categories({ selectedCategory, setSelectedCategory }) {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <section className="px-4 py-6 bg-white shadow-sm mb-6 w-full">
      <div className="flex justify-between items-center mb-4 mx-auto">
        <h2 className="ml-3 text-xl font-medium text-gray-900 tracking-normal">
          Shop by Category
        </h2>

        {/* Material UI style Text Button */}
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory("")}
            className="text-sm font-medium uppercase tracking-wider text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Embla Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pb-2 mx-1">
          {categories.map((category, index) => {
            const isActive = selectedCategory === category.name;

            return (
              <button
                key={index}
                onClick={() =>
                  setSelectedCategory(isActive ? "" : category.name)
                }
                className={`group flex min-w-[110px] flex-shrink-0 cursor-pointer flex-col items-center gap-2 rounded-xl p-4 transition-all duration-200  ${
                  isActive
                    ? "mt-2 bg-blue-50 text-blue-700 shadow-[0_0_0_1px_rgba(59,130,246,1)]"
                    : "mt-2 bg-white text-gray-600 shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                {/* Subtle Material Icon Container */}
                <div
                  className={`text-2xl transition-colors duration-200  ${
                    isActive
                      ? "text-blue-700"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                >
                  {category.icon}
                </div>

                {/* Category Name */}
                <span className="text-center text-sm font-medium tracking-wide">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}