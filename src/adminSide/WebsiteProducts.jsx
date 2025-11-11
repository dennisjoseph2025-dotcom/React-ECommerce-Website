import React from "react";
import useGet from "../Hooks/useGet";

const Products = () => {
  const { data: products } = useGet("products", "all");
  return (
    <div className=" p-7">
      <br />
      <br />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">Product Management</h1>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold absolute right-5">
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-black">
              All Products ({products.length})
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search products..."
                className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <button className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-black">
                Filter
              </button>
            </div>
          </div>
        </div>

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
                {/* <th className="p-4 text-left font-semibold text-gray-600">
                  Status
                </th> */}
                <th className="p-4 text-left font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
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
                          className="rounded-md"
                        />
                      </div>
                      <span className="font-medium  text-gray-600">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 font-semibold  text-gray-600">
                    ₹ {product.price}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        product.availability > 30
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.availability}
                    </span>
                  </td>
                  {/* <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Active
                    </span>
                  </td> */}
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
