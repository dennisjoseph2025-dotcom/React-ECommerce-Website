import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const AddProductModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    img: "",
    description: "",
    availability: "",
    sizes: [],
    category: "",
    features: "",
    status: []
  });

  const [isLoading, setIsLoading] = useState(false); // Add loading state

  console.log(formData);
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for sizes array
    if (name === "sizes") {
      // Convert comma-separated string to array and trim each value
      const sizesArray = value.split(",").map(size => size.trim()).filter(size => size !== '');
      setFormData((prev) => ({
        ...prev,
        [name]: sizesArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      price: "",
      img: "",
      description: "",
      availability: "",
      sizes: [],
      category: "",
      features: "",
      status: []
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsLoading(true);
    
    try {
      console.log("Adding product:", formData);
      
      const response = await axios.post(
        `http://localhost:2345/products`,
        formData
      );
      
      console.log("Product added successfully:", response.data);
      
      // Reset form
      resetForm();
      
      // Close modal by calling the onClose prop
      onClose();
      
      // Show success toast
      toast.success("Product added successfully! 🎉", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    } catch (error) {
      console.error("Error adding product:", error);
      
      // Show error toast
      toast.error("Failed to add product. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Add New Product
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  required
                >
                  <option value="" disabled>Select Type</option>
                  <option value="Oversized Shirts">Oversized Shirts</option>
                  <option value="Oversized Polos">Oversized Polos</option>
                  <option value="Oversized T-Shirts">Oversized T-Shirts</option>
                  <option value="Oversized Full Sleeve T-Shirts">Oversized Full Sleeve T-Shirts</option>
                  <option value="Men Oversized Sweatshirts">Men Oversized Sweatshirts</option>
                  <option value="Super Oversized T-Shirts">Super Oversized T-Shirts</option>
                  <option value="Men Oversized Hoodies">Men Oversized Hoodies</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Polos">Polos</option>
                  <option value="Beanie">Beanie</option>
                  <option value="Men High Top Sneakers Shoes">Men High Top Sneakers Shoes</option>
                  <option value="Men Low Top Sneakers Shoes">Men Low Top Sneakers Shoes</option>
                  <option value="Men Mid Top Sneakers Shoes">Men Mid Top Sneakers Shoes</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  placeholder="Enter price"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Anime/Naruto, Shirts"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>

              {/* Stock Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Availability *
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  required
                >
                  <option value="" disabled>Select Availability</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Sizes
                </label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes.join(", ")} // Convert array to string for display
                  onChange={handleInputChange}
                  placeholder="e.g., S, M, L, XL"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter sizes separated by commas (e.g., S, M, L, XL)
                </p>
              </div>

              {/* Image URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="img"
                  value={formData.img}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter Product Description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                />
              </div>

              {/* Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <textarea
                  name="features"
                  rows="3"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Enter product features"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;