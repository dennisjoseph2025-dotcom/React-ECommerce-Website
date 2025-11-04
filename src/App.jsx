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
import { CartContext } from "./context/CartContext";
import ProductDetails from "./pages/ProductDetails";
import OrderPage from "./pages/Order";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();
  let [user, setUser] = useState({ name: "", email: "", password: "" });
  let [cartDt, setCartDt] = useState({
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
    location.pathname === "*";
  // const {id} = useParams()
  return (
    <div className="bg-slate-800 w-full">
      <UserContext.Provider value={{ user, setUser }}>
        <CartContext.Provider value={{ cartDt, setCartDt }}>
          <Toaster/>
          {!noNavbar && <Navbar />}

          <br />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="beanie" element={<Beanie />} />
            <Route path="shoes" element={<Shoes />} />
            <Route path="tops" element={<Tops />} />
            <Route path="search" element={<Search />} />
            <Route path="cart" element={<Cart />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>

          <Footer />
        </CartContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
