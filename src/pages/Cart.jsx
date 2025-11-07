import React, { useContext, useState, useEffect } from "react";
import { RemoveContext } from "../context/RemoveContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Cart() {
  let { setRemoveDt } = useContext(RemoveContext);
  // State to hold currently logged-in user info fetched from backend
  const [CkUser, setCkUser] = useState({});

  // Get logged-in user info stored in localStorage (fallback to empty object)
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // On component mount, verify and find user from backend users list
  useEffect(() => {
    axios
      .get("http://localhost:2345/users")
      .then((response) => {
        // Find the user matching stored user credentials
        const foundUser = response.data.find(
          (FndUser) =>
            FndUser.name === user.name &&
            FndUser.email === user.email &&
            FndUser.password === user.password
        );
        if (foundUser) {
          setCkUser(foundUser);
        } else {
          setCkUser({ cart: [] });
        }
        if (!user.name || !user.email || !user.password) {
          // Optionally trigger navigation:
          navi("/login");
          return null; // Or render <Redirect />
        }
        console.log("Found user:", foundUser);
      })
      .catch((error) => {
        console.error(error);
        toast("NO USER FOUND");
      });
  }, []);
  console.log(CkUser);

  const RemoveCart = async (itemId) => {
    console.log("1st", itemId);

    const updatedCart = CkUser.cart.filter((item) => item.cartId !== itemId);
    await axios.patch(`http://localhost:2345/users/${CkUser.id}`, {
      cart: updatedCart,
    });
    setCkUser({ ...CkUser, cart: updatedCart });
    if (setRemoveDt) setRemoveDt(updatedCart);
  };
  // Calculate totals
  const totalItems = CkUser.cart?.length || 0;
  const totalPrice =
    CkUser.cart?.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    ) || 0;
  const navi = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      {/* Main Content */}
      <main className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <section className="flex-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Your Items
          </h2>

          {/* Normalize cart to empty array if undefined */}
          {Array.isArray(CkUser?.cart) && CkUser.cart.length > 0 ? (
            CkUser.cart.map((dt) => (
              <article
                key={dt.cartId || dt.id}
                className="flex gap-4 border-b py-4 last:border-none"
              >
                <img
                  src={dt.img || "#"}
                  alt={dt.name || "Product image"}
                  className="w-24 h-24 object-cover rounded border"
                />
                <div className="flex flex-col justify-between grow">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {dt.name}
                  </h3>
                  <p className="text-gray-600">
                    Price: <span className="font-bold">₹ {dt.price}</span>
                  </p>
                  <p className="text-gray-600">
                    Quantity:{" "}
                    <span className="font-bold">{dt.quantity || 1}</span>
                  </p>
                  <button
                    className="self-start px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                    onClick={() => RemoveCart(dt.cartId)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-600 text-center py-6">
              Your cart is empty.
            </p>
          )}
        </section>

        {/* Order Summary */}
        <aside className="w-full lg:w-96 bg-white rounded-lg shadow p-6 h-fit">
          <h3 className="text-2xl font-semibold mb-4 border-b pb-2">
            Order Summary
          </h3>
          <p className="mb-2 text-gray-700 font-medium">
            Total Items: <span className="font-bold">{totalItems}</span>
          </p>
          <p className="mb-6 text-gray-700 font-medium">
            Total Price:{" "}
            <span className="font-bold text-lg">₹ {totalPrice}</span>
          </p>
          {Array.isArray(CkUser?.cart) && CkUser.cart.length > 0 ? (
            <button
              className="w-full bg-green-500 text-white py-3 rounded font-semibold hover:bg-sky-500 transition"
              onClick={() => {
                navi("/user/order");
              }}
            >
              Proceed to Checkout
            </button>
          ) : (
            <Link to={"/user/search"}>
              <span className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-base">
                Add Somthing To The Cart
              </span>
            </Link>
          )}
        </aside>
      </main>
    </div>
  );
}

export default Cart;
