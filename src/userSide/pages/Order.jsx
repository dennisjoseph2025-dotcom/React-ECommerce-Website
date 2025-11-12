import axios from "axios";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import useGet from "../../Hooks/useGet";

const OrderPage = () => {
  const navi = useNavigate();
  const [CkUser, setCkUser] = useState({});
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { data: users, loading, error, refetch } = useGet("users");

  useEffect(() => {
    if (users && users.length > 0 && user.name) {
      const foundUser = users.find(
        (FndUser) => FndUser.name === user.name && FndUser.email === user.email
      );
      setCkUser(foundUser || {});
    }
  }, [users, user.name, user.email]);

  const totalPrice =
    CkUser.cart?.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    ) || 0;
  const totalQuantity =
    CkUser.cart?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  // Function to get product names as a string for the outer layer
  const getProductNamesString = (cart) => {
    if (!cart || cart.length === 0) return "No products";
    
    const names = cart.map(item => item.name);
    
    // If there are multiple products, show first 2 and count of others
    if (names.length <= 2) {
      return names.join(", ");
    } else {
      return `${names.slice(0, 2).join(", ")} and ${names.length - 2} more`;
    }
  };

  // Function to get all product names as an array
  const getAllProductNames = (cart) => {
    if (!cart || cart.length === 0) return [];
    return cart.map(item => item.name);
  };

  const PlaceOrder = async (e) => {
    e.preventDefault();
    
    const uniqueId = uuidv4();
    const uniqueOrderSetId = uuidv4();

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
        quantity: ct.quantity || 1,
      }));

      console.log("New Order Items:", newOrderItems);

      // Your new order set
      const newOrderSet = {
        ordersetId: uniqueOrderSetId,
        products: newOrderItems,
        quantity: totalQuantity,
        totalPrice: totalPrice,
      };

      // Create website order data with product names in outer layer
      const websiteOrderData = {
        userName: CkUser.name,
        userId: CkUser.id,
        userEmail: CkUser.email,
        ordersetId: uniqueOrderSetId,
        productNames: getAllProductNames(CkUser.cart),
        products: newOrderItems,
        quantity: totalQuantity,
        totalPrice: totalPrice,
        status: "Processing",
        orderDate: new Date().toISOString()
      };

      console.log("Website Order Data:", websiteOrderData);

      // Append to the orders array
      const updatedOrders = [...currentOrders, newOrderSet];

      // Make both API calls
      await Promise.all([
        // Update user's orders and clear cart
        axios.patch(`http://localhost:2345/users/${CkUser.id}`, {
          numberOfOrders: NewNumberOfOrders,
          order: updatedOrders,
          cart: [],
        }),
        // Create website order
        axios.post(`http://localhost:2345/websiteOrders`, websiteOrderData)
      ]);

      // Update local state
      setCkUser((prev) => ({
        ...prev,
        order: updatedOrders,
        cart: [],
      }));

      toast.success("😎 Order Placed Successfully!");
      navi("/");
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      toast.error("🙁 Failed to place order...");
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
                    <span className="font-medium">{dt.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        Qty: {dt.quantity || 1}
                      </span>
                      <span className="font-semibold">₹ {dt.price}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-2 text-gray-700">Your cart is empty.</li>
              )}
            </ul>
            <div className="flex justify-between font-bold text-gray-800 mt-4 pt-4 border-t">
              <span>Total Items: {totalQuantity}</span>
              <span>₹ {totalPrice}</span>
            </div>
          </div>
        </section>

        {/* Place Order Button */}
        <button
          className="w-full bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={PlaceOrder}
          disabled={!CkUser.cart || CkUser.cart.length === 0}
        >
          {CkUser.cart && CkUser.cart.length > 0 ? "Place Order" : "Cart is Empty"}
        </button>
      </div>
    </div>
  );
};

export default OrderPage;