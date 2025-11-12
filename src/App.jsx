import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import Login from './userSide/pages/Login'
import Signup from "./userSide/pages/Sign-up";
import { Routes, Route } from "react-router-dom";
import Home from "./userSide/pages/Home";
import Navbar from "./userSide/components/Navbar";
import NoMatch from "./userSide/pages/NoMatch";
import Beanie from "./userSide/pages/Beanie";
import Footer from "./GlobelComponent/Footer";
import Shoes from "./userSide/pages/Shoes";
import Tops from "./userSide/pages/Tops";
import Search from "./userSide/pages/Search";
import Cart from "./userSide/pages/Cart";
import UserProfile from "./userSide/pages/UserProfile";
import { UserContext } from "./userSide/context/userContext";
import { RemoveContext } from "./userSide/context/RemoveContext";
import ProductDetails from "./userSide/pages/ProductDetails";
import OrderPage from "./userSide/pages/Order";
import { Toaster } from "react-hot-toast";
import OrderSummary from "./userSide/pages/OrderSummery";
import OrderDetails from "./userSide/pages/OrderDetails";
import AdminHome from "./adminSide/pages/AdminHome";
import Products from "./adminSide/pages/WebsiteProducts";
import Orders from "./adminSide/pages/WebsiteOrders";
import Analytics from "./adminSide/pages/WebsiteAnalytics";
import Users from "./adminSide/pages/WebsiteUserDetails";
import AdminNavbar from "./adminSide/Components/AdminNavbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();
  let [user, setUser] = useState({ name: "", email: "", password: "" });
  let [removeDt, setRemoveDt] = useState({
    id: "",
    name: "",
    type: "",
    price: "",
    img: "",
    description: "",
    availability: "In Stock",
    sizes: [],
    category: "",
    features: "",
  });

  // Show Navbar except on login and signup pages
  const noNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/admin") ||
    location.pathname === "*";
  const noAdminNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/" ||
    location.pathname.startsWith("/user") ||
    location.pathname === "*";

  // const {id} = useParams()
  return (
    <div className="bg-slate-800 w-full">
      <UserContext.Provider value={{ user, setUser }}>
        <RemoveContext.Provider value={{ removeDt, setRemoveDt }}>
          <Toaster />
                <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"

      />
          {!noNavbar && <Navbar/>}
          {!noAdminNavbar && <AdminNavbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="user/beanie" element={<Beanie />} />
            <Route path="user/shoes" element={<Shoes />} />
            <Route path="user/tops" element={<Tops />} />
            <Route path="user/search" element={<Search />} />
            <Route path="user/cart" element={<Cart />} />
            <Route path="user/order" element={<OrderPage />} />
            <Route path="user/profile" element={<UserProfile />} />
            <Route path="user/ordersummery" element={<OrderSummary />} />
            <Route
              path="user/orderdetails/:ordersetId"
              element={<OrderDetails />}
            />
            <Route
              path="user/productdetails/:id"
              element={<ProductDetails />}
            />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>

          <Footer />
        </RemoveContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
