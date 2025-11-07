import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { RemoveContext } from "../context/RemoveContext";
import axios from "axios";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const [CkUsers, setCkUsers] = useState(null); // null means "loading"
  const [loading, setLoading] = useState(true);
  const { ordersetId } = useParams();
  const { user } = useContext(UserContext);
  const CkUser = JSON.parse(localStorage.getItem("user") || "{}");
  let { setRemoveDt } = useContext(RemoveContext);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:2345/users")
      .then((response) => {
        const foundUser = response.data.find(
          (FndUser) =>
            FndUser.name === CkUser.name &&
            FndUser.email === CkUser.email &&
            FndUser.password === CkUser.password
        );
        setCkUsers(foundUser || {});
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast("error");
      });
  }, []);

  // Loading spinner or message
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-2xl text-gray-700">Loading...</span>
      </div>
    );
  }

  // Not found or no orders
  if (!CkUsers || !Array.isArray(CkUsers.order) || CkUsers.order.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-2xl text-gray-700">No Orders Yet...</span>
      </div>
    );
  }

  // Find the order set (AFTER data is loaded)
  const orderSet = CkUsers.order.find((order) => order.ordersetId === ordersetId);
  const products = orderSet?.products || [];

  // Totals
  const totalQuantity = products.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = products
    .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    .toFixed(2);

  // Delete handler for this order set


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-0 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-14 mx-auto">
        <h1 className="text-4xl font-extrabold mb-12 text-[#00ace6] text-center">
          Order Details
        </h1>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-10 shadow transition-all">
          {!orderSet ? (
            <p className="text-gray-600 text-xl font-mono">Order not found...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600 text-xl font-mono">No Products in this Order...</p>
          ) : (
            <>
              <div className="font-bold mb-6 text-2xl">
                Order Id: {orderSet.ordersetId}
              </div>
              <ul className="space-y-8 font-mono text-xl text-gray-700 mb-10">
                {products.map((item, idx) => (
                  <li
                    key={item.orderId || idx}
                    className="flex items-center justify-between py-3"
                  >
                    <Link
                      to={`/user/productdetails/${item.id}`}
                      className="flex items-center gap-5 flex-1 min-w-0"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="max-h-24 max-w-24 rounded-lg object-cover"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xl font-bold text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-lg text-gray-600 mt-1">
                          Qty: {item.quantity || 1}
                        </span>
                      </div>
                    </Link>
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-semibold">
                        ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                      </span>

                    </div>
                  </li>
                ))}
              </ul>
              <div className="font-semibold text-2xl">
                Total Quantity: {totalQuantity}
                <br />
                Total Price: ₹{totalPrice}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
