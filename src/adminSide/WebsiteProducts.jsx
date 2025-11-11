import React, { useState } from "react";
import useGet from "../Hooks/useGet";
import AddProductModal from "./AddProductModel";
import axios from "axios";
import { toast } from "react-toastify";

const Products = () => {
  // State management for products, modals, and loading states
  const { data: products, refetch } = useGet("products"); // Fetch products using custom hook
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls edit modal visibility
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controls add modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // Stores the product being edited
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page state

  // Open edit modal with selected product data
  const handleEditClick = (product) => {
    setSelectedProduct({ ...product }); // Create copy to avoid direct mutation
    setIsEditModalOpen(true);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearch(value); // Set string value directly
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter products based on search
  const SearchedProducts =
    products?.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.type.toLowerCase().includes(search.toLowerCase())
    ) || [];

  // Pagination calculations
  const totalItems = SearchedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page items
  const currentItems = SearchedProducts.slice(
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
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Close edit modal and reset selected product
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  // Open add product modal
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  // Close add product modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Delete product by ID
  const DeleteProduct = async (deleteId) => {
    if (!deleteId) return;

    try {
      await axios.delete(`http://localhost:2345/products/${deleteId}`);
      refetch(); // Refresh products list after deletion
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete product");
    }
  };

  // Handle input changes in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for product updates
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsLoading(true);

    try {
      console.log("Updating product:", selectedProduct.id, selectedProduct);

      // Send PATCH request to update product
      const response = await axios.patch(
        `http://localhost:2345/products/${selectedProduct.id}`,
        selectedProduct
      );

      console.log("Update successful:", response.data);

      // Refresh the products list
      refetch();

      // Close modal
      handleCloseModal();

      // Show success toast
      toast.success("Product updated successfully! 🎉", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating product:", error);

      // Show error toast
      toast.error("Failed to update product. Please try again.", {
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

  return (
    <div className="p-7">
      <br />
      <br />
      {/* Header section with title and add product button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">Product Management</h1>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold absolute right-5"
          onClick={handleAddClick}
        >
          Add New Product
        </button>
      </div>

      {/* Products table container */}
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Table header with product count and search/filter */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-black">
              {search
                ? `Search Results (${totalItems})`
                : `All Products (${products?.length || 0})`}
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={search}
                placeholder="Search products..."
                className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                onChange={handleSearchChange}
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
            </div>
          </div>
        </div>

        {/* Products table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Product
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Category
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Price
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Stock
                </th>
                <th className="p-4 text-left font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Map through current page items and display each in a table row */}
              {currentItems.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                      </div>
                      <span className="font-medium text-gray-600">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 font-semibold text-gray-600">
                    ₹ {product.price}
                  </td>
                  <td className="p-4">
                    {/* Stock status with color coding */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        product.availability === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : product.availability === "Low Stock"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.availability}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      {/* Edit button */}
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </button>
                      {/* Delete button */}
                      <button
                        className="text-red-600 hover:text-red-800 font-medium"
                        onClick={() => DeleteProduct(product.id)}
                      >
                        Delete
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
              {search
                ? "No products found matching your search"
                : "No products available"}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-t space-y-4 sm:space-y-0">
            {/* Items count */}
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              products
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
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={page === "..."}
                  className={`px-3 py-2 border rounded-lg min-w-10 text-black ${
                    page === currentPage
                      ? "bg-blue-600  border-blue-600"
                      : page === "..."
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

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isLoading}
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

            {/* Modal body with edit form */}
            <div className="p-6">
              {selectedProduct && (
                <div className="space-y-6">
                  {/* Product preview section */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <img
                        src={selectedProduct.img}
                        alt={selectedProduct.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-gray-600">
                        {selectedProduct.category}
                      </p>
                    </div>
                  </div>

                  {/* Edit form */}
                  <form onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Product Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={selectedProduct.name || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                          required
                        />
                      </div>

                      {/* Product Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>
                        <select
                          name="type"
                          value={selectedProduct.type || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Oversized Shirts">
                            Oversized Shirts
                          </option>
                          <option value="Oversized Polos">
                            Oversized Polos
                          </option>
                          <option value="Oversized T-Shirts">
                            Oversized T-Shirts
                          </option>
                          <option value="Oversized Full Sleeve T-Shirts">
                            Oversized Full Sleeve T-Shirts
                          </option>
                          <option value="Men Oversized Sweatshirts">
                            Men Oversized Sweatshirts
                          </option>
                          <option value="Super Oversized T-Shirts">
                            Super Oversized T-Shirts
                          </option>
                          <option value="Men Oversized Hoodies">
                            Men Oversized Hoodies
                          </option>
                          <option value="T-Shirts">T-Shirts</option>
                          <option value="Polos">Polos</option>
                          <option value="Beanie">Beanie</option>
                          <option value="Men High Top Sneakers Shoes">
                            Men High Top Sneakers Shoes
                          </option>
                          <option value="Men Low Top Sneakers Shoes">
                            Men Low Top Sneakers Shoes
                          </option>
                          <option value="Men Mid Top Sneakers Shoes">
                            Men Mid Top Sneakers Shoes
                          </option>
                        </select>
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={selectedProduct.price || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                          required
                        />
                      </div>

                      {/* Stock Availability */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Availability
                        </label>
                        <select
                          name="availability"
                          value={selectedProduct.availability || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                          required
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="In Stock">In Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <input
                          name="category"
                          rows="4"
                          value={selectedProduct.category || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 resize-none"
                          required
                        />
                      </div>

                      {/* Image URL */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL
                        </label>
                        <input
                          type="url"
                          name="img"
                          value={selectedProduct.img || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          rows="4"
                          value={selectedProduct.description || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 resize-none"
                          required
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
                          value={selectedProduct.features || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 resize-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Modal footer with action buttons */}
                    <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-xl">
                      <button
                        type="button"
                        onClick={handleCloseModal}
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
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
    </div>
  );
};

export default Products;
