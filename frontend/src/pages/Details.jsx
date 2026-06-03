import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductItem from "../components/ProductItem";
import useEmblaCarousel from "embla-carousel-react";

export default function Details() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });

  const url = import.meta.env.VITE_API_URL;
  const [productsList, setProductsList] = useState([]);
  const params = useParams();

  useEffect(() => {
    fetch(`${url}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProductsList(data);
      });
  }, [url]);

  const product = productsList.find(
    (productItem) => productItem._id.toString() === params.id.toString(),
  );

  if (!product) return null;

  const relatedProducts = productsList.filter(
    (item) => item.category === product.category && item._id !== product._id,
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* MAIN CARD - Material Surface */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-10">
            {/* IMAGE SECTION */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-lg border border-gray-200 h-[400px] sm:h-[500px] flex items-center justify-center group overflow-hidden">
                {/* Product Tag */}
                {product.tag && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] uppercase tracking-wider font-bold shadow-sm">
                      {product.tag}
                    </span>
                  </div>
                )}

                {/* Sale Badge */}
                {product.oldPrice && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] uppercase tracking-wider font-bold shadow-sm">
                      SALE
                    </span>
                  </div>
                )}

                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-gray-50 border border-gray-200 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="flex flex-col">
              {/* Category */}
              <div className="mb-3">
                <span className="inline-flex items-center text-xs font-bold text-blue-600 tracking-wider uppercase">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-medium text-gray-900 leading-tight mb-4 tracking-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center text-amber-500 text-lg">
                  ★ ★ ★ ★ ★
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {product.rating || 4.8} Rating
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-4xl font-bold text-gray-900">
                  ₹{product.price}
                </h2>
                {product.oldPrice && (
                  <span className="text-xl text-gray-500 line-through font-normal">
                    ₹{product.oldPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-base mb-8">
                Experience premium quality and modern design with this amazing
                product from ShopEase. Built with durability, comfort, and
                performance in mind.
              </p>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 text-sm">
                    Premium Quality
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Carefully crafted with high-end materials.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 text-sm">
                    Fast Delivery
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Delivered quickly and safely.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 text-sm">
                    Warranty Included
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    1 year warranty included.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-medium text-gray-900 text-sm">
                    Secure Payment
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Fully encrypted checkout.
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS - Pushed to bottom using mt-auto if needed */}
              <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium tracking-wide py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                  Add to Cart
                </button>
                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium tracking-wide py-3 px-6 rounded-lg transition-colors focus:outline-none">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-medium tracking-tight text-gray-900">
                Related Products
              </h2>

              {/* Desktop Navigation (Material Icon Buttons) */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => emblaApi?.scrollPrev()}
                  className="flex items-center justify-center h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  aria-label="Previous"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => emblaApi?.scrollNext()}
                  className="flex items-center justify-center h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  aria-label="Next"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Carousel Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 pb-4">
                {relatedProducts.map((item) => (
                  <div
                    key={item._id}
                    className="flex-[0_0_280px] sm:flex-[0_0_300px]"
                  >
                    <ProductItem product={item} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}