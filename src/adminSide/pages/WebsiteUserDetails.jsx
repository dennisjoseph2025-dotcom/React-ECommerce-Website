import React, { useState } from "react";
import useGet from "../../Hooks/useGet";
import Modal from "react-modal";
import axios from "axios";

// Make sure to set the app element for accessibility
Modal.setAppElement("#root");

const Users = () => {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page state
  
  const { data: users, loading, error, refetch } = useGet("users");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    status: "Active",
  });
  const [isProcessing, setIsProcessing] = useState(false); // Add loading state for operations

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearch(value); // Set string value directly
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter users based on search
  const SearchedUsers = users?.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.status.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Pagination calculations
  const totalItems = SearchedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page items
  const currentItems = SearchedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Change page
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Generate page numbers to display (max 5 pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      status: user.status || "Active", // Use actual user status
    });
    setIsModalOpen(true);
  };

  const DeleteUser = async () => {
    if (!selectedUser) return;
    
    setIsProcessing(true);
    try {
      await axios.delete(`http://localhost:2345/users/${selectedUser.id}`);
      refetch(); // Wait for refetch to complete
      closeModal();
      // Optional: Show success message
      console.log("User deleted successfully");
    } catch (error) {
      console.error('Delete failed:', error);
      // Optional: Show error message to user
      alert('Failed to delete user');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setFormData({ status: "Active" });
    setIsProcessing(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsProcessing(true);
    try {
      await axios.patch(`http://localhost:2345/users/${selectedUser.id}`, {
        status: formData.status,
      });
      refetch(); // Wait for refetch to complete
      closeModal();
      console.log("User status updated successfully");
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update user status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add loading state for initial data fetch
  if (loading) {
    return (
      <div className="p-7 flex justify-center items-center min-h-screen">
        <div className="text-white text-xl">Loading users...</div>
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <div className="p-7 flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
        <button 
          onClick={refetch}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-7">
      <br />
      <br />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          User Management
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {users.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {users.filter(user => user.status === "Active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {users.reduce(
                  (total, user) => total + (user.numberOfOrders || 0),
                  0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Orders</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {users.length > 0
                  ? Math.round(
                      users.reduce(
                        (total, user) => total + (user.numberOfOrders || 0),
                        0
                      ) / users.length
                    )
                  : 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {search 
                ? `Search Results (${totalItems})` 
                : `All Users (${users?.length || 0})`
              }
            </h3>
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={handleSearchChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              {/* Items per page selector */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.reverse().map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 text-sm">
                      {user.date
                        ? new Date(user.date).toLocaleDateString('en-GB')
                        : "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {user.numberOfOrders || 0} orders
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-22 justify-center ${
                      user.status === "Active" ? "bg-green-100 text-green-800" :
                      user.status === "Blocked" ? "bg-red-100 text-red-800" :
                      user.status === "Suspended" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No results message */}
          {currentItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {search ? "No users found matching your search" : "No users available"}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-t space-y-4 sm:space-y-0">
            {/* Items count */}
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} users
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center space-x-2">
              {/* Previous button */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {`<<<`}
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && goToPage(page)}
                  disabled={page === '...'}
                  className={`px-3 py-2 border rounded-lg min-w-10 text-black ${
                    page === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : page === '...'
                      ? "border-transparent cursor-default"
                      : "border-gray-300 hover:bg-gray-100"
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {`>>>`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-slate-800 bg-opacity-50 z-50"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Edit User Status
              </h2>
              <button
                onClick={closeModal}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {selectedUser && (
              <p className="text-sm text-gray-600 mt-1">
                Editing:{" "}
                <span className="font-medium">{selectedUser.name}</span> (
                {selectedUser.email})
              </p>
            )}
          </div>

          {/* Modal Body */}
          <form onSubmit={handleFormSubmit} className="p-6">
            <div className="space-y-4">
              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black disabled:opacity-50"
                >
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={DeleteUser}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-gray-300 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isProcessing ? "Deleting..." : "Delete User"}
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isProcessing ? "Updating..." : "Update Status"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Users;