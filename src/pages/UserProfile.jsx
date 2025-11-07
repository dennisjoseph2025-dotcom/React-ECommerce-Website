import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [data, checkData] = useState([]);
  const [CkUsers, setCkUsers] = useState({});
  let { user, setUser } = useContext(UserContext);
  const CkUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    axios
      .get("http://localhost:2345/users")
      .then((response) => {
        checkData(response.data);
        setCkUsers(
          response.data.find(
            (FndUser) =>
              FndUser.name === CkUser.name &&
              FndUser.email === CkUser.email &&
              FndUser.password === CkUser.password
          )
        );
      })
      .catch((error) => {
        console.error(error);
        toast("😮User Not Found...");
      });
  }, []);

  const navi = useNavigate();
  const logout = () => {
    setUser({ name: "", email: "", password: "" });
    localStorage.removeItem("user");
    toast("👋Log-Out Successfull...");
    navi("/");
  };

  return (
    <div className="min-h-[86.6vh] bg-gray-50 flex flex-col items-center py-10 px-4 font-sans ">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow border border-gray-300 p-8 space-y-8">
        {/* Header row: avatar + info + logout (logout to the right) */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-300 pb-6 relative">
          {/* User Info */}
          <img
            src="https://api.dicebear.com/9.x/notionists/svg?seed=Adrian&scale=120&backgroundColor=b6e3f4"
            alt="avatar"
            className="w-28 h-28 rounded-lg border-4 border-blue-600 shadow-sm"
          />
          <div className="flex flex-col items-center md:items-start text-gray-700">
            <h1 className="text-3xl font-bold mb-1">{CkUsers.name}</h1>
            <p className="text-lg mb-1">{CkUsers.email}</p>
            <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-semibold text-sm">
              Member Profile
            </span>
          </div>
          <div className="w-full flex justify-center md:block md:absolute md:left-160 md:top-1">
            <button
              onClick={logout}
              className="
        px-7 py-2 mt-4 md:mt-0 rounded-md bg-red-600 text-white font-bold
        hover:bg-red-700 transition
      "
            >
              LOG-OUT
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Address */}
          <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Shipping Address
            </h2>
            <p className="text-gray-600 mb-1">1234 Market St</p>
            <p className="text-gray-600 mb-1">San Francisco, CA 94103</p>
            <p className="text-gray-600">United States</p>
          </div>

          {/* Order Summary */}
          {/* <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                      {!CkUsers.order || CkUsers.order.length === 0 ? (
            <p className="text-gray-600 text-lg font-mono">No Orders Yet...</p>
          ) : (
            <>
              <ul className="space-y-3 font-mono max-h-48 overflow-auto text-gray-700 mb-6 thin-scrollbar">
                {CkUsers.order.map((item, idx) => (
                  <li key={item.id || idx} className="flex justify-between border-b border-gray-100 pb-1">
                    <span>
                      {item.name} × {item.quantity || 1}
                    </span>
                    <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-200 pt-3">
                <span>Total:</span>
                <span>
                  ₹
                  {CkUsers.order
                    .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
                    .toFixed(2)}
                </span>
              </div>
            </>
          )}
          </div> */}
<div className="mt-8 flex justify-around gap-6 text-base font-semibold text-[#00ace6]">
  <Link
    to="/user/ordersummery"
    className="transition-colors px-6 py-2 rounded-md bg-[#ffffff] hover:bg-[#ddf4ff] shadow-sm duration-200"
  >
    View Order Summary
  </Link>
  <Link
    to="/user/cart"
    className="transition-colors px-6 py-2 rounded-md bg-[#ffffff] hover:bg-[#d9effa] shadow-sm duration-200"
  >
    View Cart
  </Link>
</div>

        </div>

        {/* Cart Details */}
        {/* <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Cart Details</h2>
          {!CkUsers.cart || CkUsers.cart.length === 0 ? (
            <p className="text-gray-600 text-lg font-mono">Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-3 font-mono max-h-48 overflow-auto text-gray-700 mb-6 thin-scrollbar">
                {CkUsers.cart.map((item, idx) => (
                  <li key={item.id || idx} className="flex justify-between border-b border-gray-100 pb-1">
                    <span>
                    <span className="overflow-hidden">
                      {item.name}</span> × <span className="overflow-hidden">{item.quantity || 1}
                    </span></span>
                    <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-200 pt-3">
                <span>Total:</span>
                <span>
                  ₹
                  {CkUsers.cart
                    .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
                    .toFixed(2)}
                </span>
              </div>
              <Link
                to="/cart"
                className="mt-5 mx-auto block w-max px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                View Cart
              </Link>
            </>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default UserProfile;
