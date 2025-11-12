import React, { useState } from 'react';
import useGet from '../../Hooks/useGet';
import axios from "axios";

const Orders = () => {
  const { data: websiteOrders, loading, error, refetch } = useGet('websiteOrders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: "Ordered",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Ordered': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setFormData({ status: order.status });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setFormData({ status: "Ordered" });
  };

  const sortedWebsiteOrders = Array.isArray(websiteOrders) 
    ? [...websiteOrders].reverse()
    : [];

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData({ status: value });
  };

const handleFormSubmit = async (e) => {
  e.preventDefault();
  if (!selectedOrder) return;
  
  setIsProcessing(true);
  try {
    // Get ALL websiteOrders entries with this ordersetId
    const websiteOrdersResponse = await axios.get(`http://localhost:2345/websiteOrders?ordersetId=${selectedOrder.ordersetId}`);
    const allOrdersInSet = websiteOrdersResponse.data;

    // Update ALL websiteOrders entries with this ordersetId
    const updatePromises = allOrdersInSet.map(order => 
      axios.patch(`http://localhost:2345/websiteOrders/${order.id}`, {
        status: formData.status,
      })
    );

    await Promise.all(updatePromises);

    // Then update the user's order
    const userResponse = await axios.get(`http://localhost:2345/users/${selectedOrder.userId}`);
    const user = userResponse.data;
    
    if (user && user.order) {
      const updatedOrders = user.order.map(orderSet => {
        if (orderSet.ordersetId === selectedOrder.ordersetId) {
          // Update ALL products in this order set
          const updatedProducts = orderSet.products.map(product => ({
            ...product,
            status: formData.status
          }));
          
          return {
            ...orderSet,
            products: updatedProducts,
            status: formData.status // Update the entire order set status
          };
        }
        return orderSet;
      });

      await axios.patch(`http://localhost:2345/users/${selectedOrder.userId}`, {
        order: updatedOrders
      });
    }
    
    console.log("All orders in set updated successfully");
    await refetch();
    closeModal();
  } catch (error) {
    console.error('Update failed:', error);
    console.error('Error details:', error.response?.data);
    alert(`Failed to update order status: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsProcessing(false);
  }
};

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to load orders</h2>
          <p className="text-gray-600 mb-4">{error.message || 'Something went wrong'}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <br/>
      <br/>
      <br/>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">Order Management</h1>
        <div className="flex space-x-3 absolute right-5">
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-black">Recent Orders</h3>
          <p className="text-gray-600 mt-1">
            {sortedWebsiteOrders.length} order{sortedWebsiteOrders.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="p-6">
          {sortedWebsiteOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
              <p className="text-gray-500">There are no orders to display at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedWebsiteOrders.map((order, index) => (
                <div key={`${order.id}-${index}`} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <p className="font-semibold text-lg text-black">Products : {order.productNames.join(" | ")}</p>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">Customer: {order.userName}</p>
                      <p className="text-gray-600 mb-1">Email: {order.userEmail || 'N/A'}</p>
                      <p className="text-gray-600 mb-1">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                      <p className="text-gray-600">Order ID: {order.ordersetId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800 mb-2">₹ {order.totalPrice}</p>
                      <p className="text-gray-600 mb-2">Qty: {order.quantity}</p>
                      <div className="flex space-x-2">
                        {order.status === "Order Canceled"? (
                          <span className="text-white bg-red-500 rounded-md px-4 py-2 hover:bg-red-600 transition-colors">
                            The Order Is Canceled
                          </span>):(<button 
                          onClick={() => openEditModal(order)}
                          className="text-white bg-green-500 rounded-md px-4 py-2 hover:bg-green-600 transition-colors"
                        >
                          Update
                        </button>)}
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Order Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <form onSubmit={handleFormSubmit}>
              {/* Modal Header */}
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">Update Order Status</h2>
                <p className="text-gray-600 mt-1">Order ID: {selectedOrder.id}</p>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">
                      {selectedOrder.userName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product
                    </label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">
                      {selectedOrder.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Status
                    </label>
                    <span className={`px-3 py-2 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select 
                      className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                    >
                      <option value="Ordered">Ordered</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;