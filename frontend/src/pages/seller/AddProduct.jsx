import { useContext } from "react";
import { Form } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SellerOnly from "./SellerOnly";

const AddProduct = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  const categories = [
    "Smart Watch",
    "Audio",
    "Shoes",
    "Camera",
    "Accessories",
    "Mobile",
    "Home",
    "Fashion",
    "Computer",
    "Electronics",
    "Wearables",
    "Sports & Outdoors",
  ];

  const sectionTitles = [
    "Trending Products",
    "Best Selling",
    "New Arrivals",
    "Top Rated",
    "Flash Sale",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = import.meta.env.VITE_API_URL;
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      data["sectionTitle"] =
        sectionTitles[Math.floor(Math.random() * sectionTitles.length)];
      data["hostId"] = user._id;

      const response = await fetch(`${url}/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        alert("Product added successfully!");
        e.target.reset();
      } else {
        alert(result.message || "Failed to add product");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  if (user?.loginType !== "seller") {
    return <SellerOnly />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 flex justify-center">
      <div className="w-full max-w-6xl grid lg:grid-cols-[380px_1fr] bg-white rounded-xl shadow-md overflow-hidden">
        {/* LEFT PANEL - Material Solid Surface */}
        <div className="hidden lg:flex flex-col justify-between bg-blue-700 p-10 text-white">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded bg-blue-800 text-xs font-medium tracking-wide uppercase mb-8">
              Seller Dashboard
            </div>
            <h1 className="text-3xl font-medium leading-tight mb-4 tracking-tight">
              Add a New
              <br />
              Product Listing
            </h1>
            <p className="text-blue-100 text-base leading-relaxed opacity-90">
              Provide detailed information, pricing, and high-quality images to
              make your product stand out on ShopEase.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 border-t border-blue-600 pt-8">
            <div>
              <h2 className="text-2xl font-medium">10K+</h2>
              <p className="text-xs text-blue-200 mt-1 uppercase tracking-wider">
                Total Listings
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-medium">98%</h2>
              <p className="text-xs text-blue-200 mt-1 uppercase tracking-wider">
                Satisfaction
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Standard Material Form */}
        <div className="p-6 sm:p-8 lg:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">
              Product Details
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Ensure all fields are filled correctly before publishing.
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Apple Watch Series 9"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue=""
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="399"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                  Old Price (₹)
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  placeholder="499"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.8"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wide">
                  Product Tag
                </label>
                <select
                  name="tag"
                  defaultValue=""
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all text-sm"
                >
                  <option value="">No Tag</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                  <option value="Best">Best</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 mt-4 border-t border-gray-200">
              <button
                type="reset"
                className="w-full sm:w-auto px-6 py-2 rounded-lg text-sm font-medium tracking-wide text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none"
              >
                Reset
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 rounded-lg text-sm font-medium tracking-wide bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors focus:outline-none"
              >
                Save Product
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
