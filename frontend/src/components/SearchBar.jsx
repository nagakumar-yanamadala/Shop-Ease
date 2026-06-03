import { CiSearch } from "react-icons/ci";
import { FiX } from "react-icons/fi";

export default function SearchBar({ searchQuery, setSearchQuery, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
      }}
      className="mx-4 my-2 flex flex-1 items-stretch overflow-hidden rounded-lg border border-gray-400 bg-white transition-all duration-200 hover:border-gray-600 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 focus-within:hover:border-blue-600 lg:mx-8"
    >
      <input
        type="text"
        placeholder="Search for products, brands, and more..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full flex-1 appearance-none bg-transparent px-4 py-2.5 text-sm font-normal text-gray-900 placeholder-gray-600 outline-none"
        aria-label="Search input"
      />

      {/* Clear Button */}
      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            if (onSubmit) onSubmit(""); // Trigger empty search to clear results
          }}
          className="flex items-center justify-center px-3 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none"
          aria-label="Clear search"
        >
          <FiX className="text-xl" />
        </button>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="flex items-center justify-center bg-blue-600 px-6 text-white transition-colors duration-200 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
        aria-label="Submit search"
      >
        <CiSearch className="text-xl stroke-[1]" />
      </button>
    </form>
  );
}
