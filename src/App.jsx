import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Sign-up";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import NoMatch from "./pages/NoMatch";
import Beanie from "./pages/Beanie";
import Footer from "./components/Footer";
import Shoes from "./pages/Shoes";
import Tops from "./pages/Tops";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import UserProfile from "./pages/UserProfile";
import { UserContext } from "./context/userContext";
import { RemoveContext } from "./context/RemoveContext";
import ProductDetails from "./pages/ProductDetails";
import OrderPage from "./pages/Order";
import { Toaster } from "react-hot-toast";
import OrderSummary from "./pages/OrderSummery";
import OrderDetails from "./pages/OrderDetails";
import AdminHome from "./adminSide/AdminHome";
import AdminUserProfile from "./adminSide/AdminUserProfile";
import Products from "./adminSide/WebsiteProducts";
import Orders from "./adminSide/WebsiteOrders";
import Analytics from "./adminSide/WebsiteAnalytics";
import Users from "./adminSide/WebsiteUserDetails";

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
    location.pathname === "/admin" ||
    location.pathname === "/admin/users" ||
    location.pathname === "/admin/analytics" ||
    location.pathname === "/admin/products" ||
    location.pathname === "/admin/orders" ||
    location.pathname === "*";
  // const {id} = useParams()
  return (
    <div className="bg-slate-800 w-full">
      <UserContext.Provider value={{ user, setUser }}>
        <RemoveContext.Provider value={{ removeDt, setRemoveDt }}>
          <Toaster/>
          {!noNavbar && <Navbar />}

          <br />
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
            <Route path="user/orderdetails/:ordersetId" element={<OrderDetails />} />
            <Route path="user/productdetails/:id" element={<ProductDetails />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/products"element={<Products/>}/>
            <Route path="/admin/orders"element={<Orders/>}/>
            <Route path="/admin/analytics"element={<Analytics/>}/>
            <Route path="/admin/users"element={<Users/>}/>
            <Route path="/admin/profile" element={<AdminUserProfile />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>

          <Footer />
        </RemoveContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
