import SearchBar from "../components/SearchBar";
import Categories from "../components/Categories";
import Products from "../components/Products";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Home = () => {
  const url = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);

  // Router hooks for URL processing
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize state from URL params if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("");

  const sectionTitles = [
    "Trending Products",
    "Best Selling",
    "New Arrivals",
    "Top Rated",
    "Flash Sale",
  ];

  // Sync Home search state if the Header search updates the URL
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    fetch(`${url}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, [url]);

  // --- FILTERING LOGIC ---
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  // --- SECTION GENERATION ---
  let sections = [];
  if (searchQuery || selectedCategory) {
    sections = [
      {
        title: searchQuery
          ? `Search Results for "${searchQuery}"`
          : `${selectedCategory} Products`,
        products: filteredProducts,
      },
    ];
  } else {
    sections = sectionTitles.map((title) => ({
      title,
      products: products.filter((product) => product.sectionTitle === title),
    }));
  }

  // Handle Mobile Search submission
  const handleMobileSearchSubmit = (clearedQuery) => {
    const queryToSearch =
      clearedQuery !== undefined ? clearedQuery : searchQuery;
    if (queryToSearch.trim()) {
      navigate(`/?q=${encodeURIComponent(queryToSearch)}`);
    } else {
      navigate("/");
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      {/* Mobile Search Bar */}
      <div className="xl:hidden pt-4 max-w-7xl mx-auto w-full">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSubmit={handleMobileSearchSubmit}
        />
      </div>

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Empty State vs Products Render */}
      {sections.length > 0 &&
      sections[0].products.length === 0 &&
      (searchQuery || selectedCategory) ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in max-w-7xl mx-auto w-full">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-gray-200">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 tracking-tight mb-2">
            No products found
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md">
            We couldn't find any items matching your current search or category
            filters. Try adjusting your query.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              if (searchParams.has("q")) navigate("/"); // Clear URL param
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide py-2.5 px-6 rounded-lg transition-colors focus:outline-none"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <Products sections={sections} />
      )}
    </main>
  );
};

export default Home;