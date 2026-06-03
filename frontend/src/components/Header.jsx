import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Package,
  PlusSquare,
  Boxes,
  UserCircle2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import navlogo from "../assets/navlogo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser, loading } = useContext(AuthContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Local state for the Header's search bar
  const [headerSearch, setHeaderSearch] = useState("");

  const isUserMode = user?.loginType === "buyer";
  const isSellerMode = user?.loginType === "seller";

  // Keep the header search bar in sync with the URL
  useEffect(() => {
    setHeaderSearch(searchParams.get("q") || "");
  }, [searchParams]);

  // Handle the search submission
  const handleSearchSubmit = (clearedQuery) => {
    const queryToSearch =
      clearedQuery !== undefined ? clearedQuery : headerSearch;
    if (queryToSearch.trim()) {
      navigate(`/?q=${encodeURIComponent(queryToSearch)}`);
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-4 xl:gap-8">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="lg:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="flex items-center">
                <img
                  src={navlogo}
                  alt="ShopEase Logo"
                  className="h-9 sm:h-10 xl:h-12 object-contain cursor-pointer"
                />
              </Link>
            </div>

            {/* SEARCH BAR WIRING */}
            <div className="hidden xl:flex flex-1 max-w-3xl mx-10">
              <SearchBar
                searchQuery={headerSearch}
                setSearchQuery={setHeaderSearch}
                onSubmit={handleSearchSubmit}
              />
            </div>

            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {user ? (
                <>
                  {isUserMode && (
                    <div className="flex items-center gap-1">
                      <Link to="/favourites">
                        <NavIcon
                          icon={<Heart className="w-5 h-5" />}
                          label="Wishlist"
                        />
                      </Link>
                      <Link to="/cart">
                        <NavIcon
                          icon={
                            <div className="relative">
                              <ShoppingBag className="w-5 h-5" />
                            </div>
                          }
                          label="Cart"
                        />
                      </Link>
                      <Link to="/track-order">
                        <NavIcon
                          icon={<Package className="w-5 h-5" />}
                          label="Orders"
                        />
                      </Link>
                    </div>
                  )}

                  {isSellerMode && (
                    <div className="flex items-center gap-1">
                      <Link to="/add-product">
                        <NavIcon
                          icon={<PlusSquare className="w-5 h-5" />}
                          label="Add"
                        />
                      </Link>
                      <Link to="/my-products">
                        <NavIcon
                          icon={<Boxes className="w-5 h-5" />}
                          label="Products"
                        />
                      </Link>
                      <Link to="/my-orders">
                        <NavIcon
                          icon={<Package className="w-5 h-5" />}
                          label="Orders"
                        />
                      </Link>
                    </div>
                  )}

                  <div className="h-6 w-px bg-gray-300 mx-3"></div>

                  <Link to="/profile">
                    <NavIcon
                      icon={<UserCircle2 className="w-5 h-5" />}
                      label="Profile"
                    />
                  </Link>

                  <button onClick={handleLogout}>
                    <NavIcon
                      icon={<LogOut className="w-5 h-5" />}
                      label="Logout"
                    />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 pl-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full text-sm font-medium tracking-wide text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 rounded-full text-sm font-medium tracking-wide bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {isUserMode && (
              <div className="flex lg:hidden items-center">
                <Link
                  to="/cart"
                  className="p-2 relative text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white font-bold flex items-center justify-center border border-white">
                    2
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
        ></div>
        <div
          className={`absolute top-0 left-0 h-full w-[80%] max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <img
              src={navlogo}
              alt="ShopEase Logo"
              className="h-8 object-contain"
            />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="p-2 flex-1 overflow-y-auto">
            {user ? (
              <ul className="flex flex-col gap-1">
                {isUserMode && (
                  <>
                    <Link to="/favourites">
                      <MobileNavItem
                        icon={<Heart className="w-5 h-5" />}
                        label="Wishlist"
                      />
                    </Link>
                    <Link to="/cart">
                      <MobileNavItem
                        icon={<ShoppingBag className="w-5 h-5" />}
                        label="Cart"
                      />
                    </Link>
                    <Link to="/track-order">
                      <MobileNavItem
                        icon={<Package className="w-5 h-5" />}
                        label="Track Orders"
                      />
                    </Link>
                  </>
                )}
                {isSellerMode && (
                  <>
                    <Link to="/add-product">
                      <MobileNavItem
                        icon={<PlusSquare className="w-5 h-5" />}
                        label="Add Product"
                      />
                    </Link>
                    <Link to="/my-products">
                      <MobileNavItem
                        icon={<Boxes className="w-5 h-5" />}
                        label="My Products"
                      />
                    </Link>
                    <Link to="/my-orders">
                      <MobileNavItem
                        icon={<Package className="w-5 h-5" />}
                        label="Orders"
                      />
                    </Link>
                  </>
                )}
                <div className="h-px bg-gray-200 my-2 mx-2"></div>
                <Link to="/profile">
                  <MobileNavItem
                    icon={<UserCircle2 className="w-5 h-5" />}
                    label="Profile"
                  />
                </Link>
                <div onClick={handleLogout}>
                  <MobileNavItem
                    icon={<LogOut className="w-5 h-5" />}
                    label="Logout"
                  />
                </div>
              </ul>
            ) : (
              <div className="flex flex-col gap-3 p-2 mt-4">
                <Link
                  to="/login"
                  className="w-full py-2.5 rounded-full border border-gray-300 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="w-full py-2.5 rounded-full bg-blue-600 text-center text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

function NavIcon({ icon, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors cursor-pointer">
      <span className="text-inherit">{icon}</span>
      <span className="hidden 2xl:block text-sm font-medium tracking-wide">
        {label}
      </span>
    </div>
  );
}

function MobileNavItem({ icon, label }) {
  return (
    <li className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer">
      <span className="text-gray-500 group-hover:text-inherit">{icon}</span>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </li>
  );
}

export default Header;
