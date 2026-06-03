// Products.jsx
import useEmblaCarousel from "embla-carousel-react";
import ProductItem from "./ProductItem";

function ProductCarousel({ title, products }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-medium tracking-tight text-gray-900">
          {title}
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
          {products.map((product) => (
            <div
              className="flex-[0_0_280px] sm:flex-[0_0_300px]"
              key={product._id}
            >
              <ProductItem product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Products({ sections }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 mx-auto w-full">
      {sections.map((section) =>
        section.products.length !== 0 ? (
          <ProductCarousel
            key={section.title}
            title={section.title}
            products={section.products}
          />
        ) : null,
      )}
    </section>
  );
}