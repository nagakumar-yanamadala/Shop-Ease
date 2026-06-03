import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import "tailwindcss";

import App from "./App.jsx";

// CONTEXT
import AuthProvider from "./context/AuthProvider.jsx";
import { AlertProvider } from "./context/AlertContext.jsx";
// PAGES
import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import Details from "./pages/Details.jsx";
import Profile from "./pages/Profile.jsx";

// SELLER
import AddProduct from "./pages/seller/AddProduct.jsx";
import SellerOrders from "./pages/seller/SellerOrders.jsx";
import MyProducts from "./pages/seller/MyProducts.jsx";

// USER
import Cart from "./pages/user/Cart.jsx";
import Favourites from "./pages/user/Favourites.jsx";
import TrackOrder from "./pages/user/TrackOrder.jsx";
import CheckoutPage from "./pages/user/CheckoutPage.jsx";


const route = createBrowserRouter([
  {
    path: "/",
    Component: App,

    children: [
      {
        path: "",
        Component: Home,
      },

      {
        path: "login",
        Component: Login,
      },

      {
        path: "signup",
        Component: SignUp,
      },

      {
        path: "details/:id",
        Component: Details,
      },
      {
        path: "profile",
        Component: Profile,
      },

      // SELLER ROUTES
      {
        path: "add-product",
        Component: AddProduct,
      },

      {
        path: "my-orders",
        Component: SellerOrders,
      },

      {
        path: "my-products",
        Component: MyProducts,
      },

      // USER ROUTES
      {
        path: "cart",
        Component: Cart,
      },

      {
        path: "favourites",
        Component: Favourites,
      },

      {
        path: "track-order",
        Component: TrackOrder,
      },
      {
        path: "checkout/:id",
        Component: CheckoutPage,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AlertProvider>
        <RouterProvider router={route} />
      </AlertProvider>
    </AuthProvider>
  </StrictMode>,
);
