import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { RemoveContext } from "../context/RemoveContext";
import useGet from "../../Hooks/useGet";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const OrderSummary = () => {
  const [CkUsers, setCkUsers] = useState({});
  const { user } = useContext(UserContext);
  const CkUser = JSON.parse(localStorage.getItem("user") || "{}");
  let { setRemoveDt } = useContext(RemoveContext);
  const { data: users, loading, error, refetch } = useGet("users");
  const [NewNumberOfOrders, setNewNumberOfOrders] = useState();

  useEffect(() => {
    if (users && users.length > 0 && CkUser.name) {
      const foundUser = users.find(
        (FndUser) =>
          FndUser.name === CkUser.name && FndUser.email === CkUser.email
      );
      setCkUsers(foundUser || {});
      console.log("Found user:", foundUser);
    }
  }, [users, CkUser.name, CkUser.email]);

  console.log("CkUsers:", CkUsers);
  console.log(NewNumberOfOrders);

  const OnDelete = async (ordersetId) => {
    try {
      console.log("Cancelling order:", ordersetId);
      console.log("Current user ID:", CkUsers.id);
      console.log("Current orders:", CkUsers.order);

      // Find the order set first
      const orderSetToCancel = CkUsers.order.find(
        (orderSet) => orderSet.ordersetId === ordersetId
      );

      if (!orderSetToCancel) {
        console.error("Order set not found");
        return;
      }

      // Calculate the new number of orders
      const calculatedNewNumberOfOrders =
        CkUsers.numberOfOrders - orderSetToCancel.quantity;

      console.log("Quantity to subtract:", orderSetToCancel.quantity);
      console.log("New calculated orders:", calculatedNewNumberOfOrders);

      // Update the order status
      const updatedOrder = CkUsers.order.map((orderSet) => {
        if (orderSet.ordersetId === ordersetId) {
          const updatedProducts = orderSet.products.map((product) => ({
            ...product,
            status: "Order Canceled",
          }));

          return {
            ...orderSet,
            products: updatedProducts,
          };
        }
        return orderSet;
      });

      console.log("Updated orders to send:", updatedOrder);

      // Update user's order and numberOfOrders
      const response = await axios.patch(
        `http://localhost:2345/users/${CkUsers.id}`,
        {
          numberOfOrders: calculatedNewNumberOfOrders,
          order: updatedOrder,
        }
      );

      // Update websiteOrders - FIXED VERSION
      // First, get all websiteOrders to find the correct ones
      const websiteOrdersResponse = await axios.get(
        "http://localhost:2345/websiteOrders"
      );
      const allWebsiteOrders = websiteOrdersResponse.data;

      // Find website orders that match this order set
      const websiteOrdersToUpdate = allWebsiteOrders.filter(
        (websiteOrder) =>
          websiteOrder.orderId === ordersetId || 
          websiteOrder.ordersetId === ordersetId
      );

      console.log("Website orders to update:", websiteOrdersToUpdate);

      // Update each matching website order
      for (const websiteOrder of websiteOrdersToUpdate) {
        await axios.patch(
          `http://localhost:2345/websiteOrders/${websiteOrder.id}`,
          {
            status: "Order Canceled",
          }
        );
        console.log(`Updated websiteOrder ${websiteOrder.id} to cancelled`);
      }

      console.log("Server response:", response);

      // Update local state
      setCkUsers((prev) => ({
        ...prev,
        numberOfOrders: calculatedNewNumberOfOrders,
        order: updatedOrder,
      }));

      setNewNumberOfOrders(calculatedNewNumberOfOrders);

      toast.success("Order cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      console.error("Error response:", error.response);
      toast.error("Failed to cancel order");
    }
  };

  // Sort orders by ordersetId (newest first)
  const sortedOrders = Array.isArray(CkUsers.order)
    ? [...CkUsers.order].reverse()
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-14 mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-center text-[#00ace6]">
            Order Summary
          </h1>
        </header>

        <section className="bg-gray-50 rounded-lg border border-gray-200 p-8 shadow transition-all">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Order Details
          </h2>

          {!Array.isArray(CkUsers.order) || CkUsers.order.length === 0 ? (
            <p className="text-gray-600 text-xl font-mono">No Orders Yet...</p>
          ) : (
            <>
              <ul className="space-y-8 font-mono text-xl text-gray-700 mb-10">
                {sortedOrders.map((order) => (
                  <li
                    key={order.ordersetId}
                    className="mb-6 pb-6 border-b-2 border-gray-300"
                  >
                    <div className="font-bold mb-3">
                      Order Id: {order.ordersetId}
                    </div>

                    <ul className="flex flex-col space-y-4 grow min-w-0">
                      {Array.isArray(order.products) &&
                        order.products.map((item, idx) => (
                          <li
                            key={item.orderId + idx}
                            className="flex items-center justify-between py-3"
                          >
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="flex flex-col min-w-0 grow ml-4">
                              <span className="text-xl font-bold text-gray-900 truncate">
                                {item.name}
                              </span>
                              <span className="text-lg text-gray-600 mt-1">
                                Qty: {item.quantity || 1}
                              </span>
                              <span className="text-lg text-gray-600 mt-1">
                                {item.status}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xl font-semibold">
                                ₹
                                {(item.price * (item.quantity || 1)).toFixed(2)}
                              </span>
                            </div>
                          </li>
                        ))}
                    </ul>

                    {/* Order summary section */}
                    <div className="font-semibold mt-4">
                      Total Quantity:{" "}
                      {Array.isArray(order.products)
                        ? order.products.reduce(
                            (sum, item) => sum + (item.quantity || 1),
                            0
                          )
                        : 0}
                      <br />
                      Total Price: ₹
                      {Array.isArray(order.products)
                        ? order.products
                            .reduce(
                              (sum, item) =>
                                sum + (item.price || 0) * (item.quantity || 1),
                              0
                            )
                            .toFixed(2)
                        : "0.00"}
                    </div>
                    {order.products.some(
                      (item) =>
                        item.status === "Processing" ||
                        item.status === "Ordered" ||
                        item.status === "Suspended" ||
                        item.status === "Shipped"
                    ) ? (
                      <button
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-sky-700 transition-colors text-base"
                        onClick={() => OnDelete(order.ordersetId)}
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <span className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-base">
                        Order Canceled
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrderSummary;