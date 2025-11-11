import axios from "axios";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useGet from "../Hooks/useGet";

const OrderPage = () => {
  const navi = useNavigate();
  // State to hold currently logged-in user info fetched from backend
  const [CkUser, setCkUser] = useState({});
  const [websiteOrders, setWebsiteOrders] = useState({});

  // Get logged-in user info stored in localStorage (fallback to empty object)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { data: users, loading, error, refetch } = useGet("users");

  // On component mount, verify and find user from backend users list
  useEffect(() => {
    if (users && users.length > 0 && user.name) {
      const foundUser = users.find(
        (FndUser) => FndUser.name === user.name && FndUser.email === user.email
      );
      setCkUser(foundUser || {});
      console.log("Found user:", foundUser);
    }
  }, [users, user.name, user.email]);
  console.log(users);

  console.log("CkUsers:", CkUser);

  const totalPrice =
    CkUser.cart?.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    ) || 0;
  const totalQuantity =
    CkUser.cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  const PlaceOrder = async (e) => {
    e.preventDefault();
const uniqueId =uuidv4()
const uniqueOrderSetId = uuidv4()
    try {
      // Fetch current user data
      const resUser = await axios.get(
        `http://localhost:2345/users/${CkUser.id}`
      );
      const currentOrders = resUser.data.order || [];
      const NewNumberOfOrders = CkUser.numberOfOrders + totalQuantity;
      // Map current cart to new order items
      const newOrderItems = CkUser.cart.map((ct) => ({
        orderId: uniqueId,
        id: ct.id,
        name: ct.name,
        type: ct.type,
        price: ct.price,
        img: ct.img,
        description: ct.description,
        availability: ct.availability,
        sizes: ct.sizes,
        category: ct.category,
        features: ct.features,
        status: "Processing",
        quantity: ct.quantity,
      }));
      
      // Your new order set
      const newOrderSet = {
        ordersetId: uniqueOrderSetId,
        products: newOrderItems,
        quantity: totalQuantity,
        totalPrice: totalPrice,
      };
      
      // Append to the orders array
      const updatedOrders = [...currentOrders, newOrderSet];
      
      
      // PATCH user's orders and clear cart
      await axios.patch(`http://localhost:2345/users/${CkUser.id}`, {
        numberOfOrders: NewNumberOfOrders,
        order: updatedOrders,
        cart: [],
      });
      
      // Create website orders (individual items for admin view)
CkUser.cart.map(async (ct) => {
        const websiteOrder = {
          id: uniqueId,
          ordersetId: uniqueOrderSetId,
          productId: ct.id,
          userName: CkUser.name,
          userId: CkUser.id,
          userEmail:CkUser.email,
          name: ct.name,
          type: ct.type,
          price: ct.price,
          img: ct.img,
          quantity: ct.quantity || 1,
          availability: ct.availability,
          sizes: ct.sizes,
          status: "Processing",
          orderDate: new Date().toISOString()
        };
        
        return axios.post(`http://localhost:2345/websiteOrders`, websiteOrder);
      });


      setCkUser((prev) => ({
        ...prev,
        order: updatedOrders,
        cart: [],
      }));

      toast("😎Order Placed...");
      navi("/");
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      toast("🙁Failed to place order...");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Place Your Order
        </h1>
        {/* Order Summary */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Order Summary
          </h2>
          <div className="border border-gray-300 rounded-md p-4">
            <ul className="divide-y divide-gray-200 max-h-48 overflow-auto thin-scrollbar">
              {CkUser &&
              Array.isArray(CkUser.cart) &&
              CkUser.cart.length > 0 ? (
                CkUser.cart.map((dt) => (
                  <li
                    key={dt.cartId || dt.id}
                    className="flex justify-between py-2 text-gray-700"
                  >
                    <span>{dt.name}</span>
                    <span>₹ {dt.price}</span>
                  </li>
                ))
              ) : (
                <li className="py-2 text-gray-700">Your cart is empty.</li>
              )}
            </ul>
            <div className="flex justify-between font-bold text-gray-800 mt-4">
              <span>Total</span>
              <span>₹ {totalPrice}</span>
            </div>
          </div>
        </section>

        {/* Place Order Button */}
        <button
          className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={PlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
