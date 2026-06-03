export default function SellerOnly() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center animate-fade-in">
        {/* Icon Container */}
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 tracking-tight">
          Seller Access Only
        </h1>

        <p className="mt-3 text-gray-600 text-sm leading-relaxed mb-8">
          You are not authorized to access this page. Please log in with a
          seller account to manage products and inventory on ShopEase.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium tracking-wide hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Go Home
          </a>

          <a
            href="/profile"
            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium tracking-wide shadow-sm hover:bg-blue-700 transition-colors"
          >
            Login as Seller
          </a>
        </div>
      </div>
    </div>
  );
}
