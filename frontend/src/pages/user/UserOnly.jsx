export default function UserOnly() {
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 tracking-tight">
          User Access Only
        </h1>

        <p className="mt-3 text-gray-600 text-sm leading-relaxed mb-8">
          Seller accounts cannot access this page. Please continue with a buyer
          account to browse products, manage favourites, and track orders on
          ShopEase.
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
            Login as User
          </a>
        </div>
      </div>
    </div>
  );
}