// components/admin/AdminDashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGet from "../Hooks/useGet";
const AdminHome = () => {
  const { data: users, loading, error, refetch } = useGet("users");
  const { data: products } = useGet("products");
  const { data: websiteOrders } = useGet("websiteOrders");
  const nav = useNavigate();
  const navigate = useNavigate();
  const logout = () => {
    // setUser({ name: "", email: "", password: "" });
    localStorage.clear();
    toast("👋Log-Out Successfull...");
    navigate("/");
  };
  const overallQuantity = Array.isArray(users)
    ? users
        .filter((u) => Array.isArray(u.order)) // Only users with a valid order array
        .reduce(
          (sum, user) =>
            sum +
            user.order.reduce(
              (orderSum, orderSet) =>
                orderSum +
                (Array.isArray(orderSet.products)
                  ? orderSet.products.reduce(
                      (productSum, item) => productSum + (item.quantity || 1),
                      0
                    )
                  : 0),
              0
            ),
          0
        )
    : 0;

  const totalRevenue = websiteOrders.reduce(
    (sum, order) => sum + order.price * order.quantity,
    0
  );
  const totalOrders = users.reduce(
    (total, user) => total + (user.numberOfOrders || 0),
    0
  );
  const averageOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const sortedWebsiteOrders = Array.isArray(websiteOrders)
    ? [...websiteOrders].reverse()
    : [];
  return (
    <div className="space-y-6 p-7">
      <br />
      <br />
      <br />
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-light text-gray-900 mb-2">
          Welcome back, Admin
        </h1>
        {/* <p className="text-gray-600">Here's what's happening with your store today. </p>  */}
        <button
          className="text-white bg-red-600 rounded-md border-2 h-10 w-25 absolute top-28 right-7 hover:bg-red-500 hover:text-black"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-light text-gray-900 mt-1">
                {products.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-lg">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-light text-gray-900 mt-1">
                {totalOrders}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <span className="text-lg">🛒</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-light text-gray-900 mt-1">
                {users.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-light text-gray-900 mt-1">
                ₹ {totalRevenue}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-3">
            {sortedWebsiteOrders.slice(0, 4).map((product) => (
              <div
                key={product.orderId}
                className="flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0"
              >
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {product.id}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.orderDate
                      ? new Date(product.orderDate).toLocaleDateString("en-GB")
                      : "N/A"}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="flex-1 min-w-0 text-center">
                  <p className="font-medium text-gray-900 truncate">
                    {product.userName}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {product.userEmail}
                  </p>
                </div>

                {/* Price & Status */}
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-medium text-gray-900">₹ {product.price}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : product.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.status}{" "}
                    {/* Fixed: changed from availability to status */}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            onClick={() => nav("/admin/products")}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-sm">📦</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Products</p>
          </button>

          <button
            className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
            onClick={() => nav("/admin/orders")}
            >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-sm">👁️</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Orders</p>
          </button>

          <button
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
            onClick={() => nav("/admin/analytics")}
            >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-sm">📊</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Analytics</p>
          </button>

          <button
            className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
            onClick={() => nav("/admin/users")}
          >
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-sm">👥</span>
            </div>
            <p className="text-sm font-medium text-gray-900">Manage Users</p>
          </button>
        </div>
      </div>
    </div>
            </div>
  );
};

export default AdminHome;
