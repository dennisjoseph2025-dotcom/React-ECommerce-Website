import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { RemoveContext } from "../context/RemoveContext";
import useGet from "../Hooks/useGet";
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

  const OnDelete = async (ordersetId) => {
    try {
      console.log("Cancelling order:", ordersetId);
      console.log("Current user ID:", CkUsers.id);
      console.log("Current orders:", CkUsers.order);

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

      const response = await axios.patch(
        `http://localhost:2345/users/${CkUsers.id}`,
        {
          order: updatedOrder,
        }
      );
      // Update websiteOrders - find all entries with this ordersetId and update them
      const websiteOrdersToUpdate =
        CkUsers.order.find((order) => order.ordersetId === ordersetId)
          ?.products || [];

      // Update each websiteOrder entry individually
      for (const product of websiteOrdersToUpdate) {
        await axios.patch(
          `http://localhost:2345/websiteOrders/${product.orderId}`,
          {
            status: "Order Canceled",
          }
        );
      }

      console.log("Server response:", response);

      setCkUsers((prev) => ({
        ...prev,
        order: updatedOrder,
      }));

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

                    {/* Link wrapping the products list */}
                    {/* <Link
                      to={`/user/orderdetails/${order.ordersetId}`}
                      className="flex items-center gap-5 flex-wrap"
                    > */}
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
                                  {(item.price * (item.quantity || 1)).toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    {/* </Link> */}

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
