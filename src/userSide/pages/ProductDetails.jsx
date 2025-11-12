import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { RemoveContext } from "../context/RemoveContext";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useGet from '../../Hooks/useGet';
function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  // Extract product ID from route params
  const { id } = useParams();

  // State to hold product details
  const [product, setProduct] = useState(null);

  // Cart context to get and update cart data
  let { removeDt, setRemoveDt } = useContext(RemoveContext);

  // State to hold currently logged-in user info fetched from backend
  const [CkUser, setCkUser] = useState();

  // Get logged-in user info stored in localStorage (fallback to empty object)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedSize, setSelectedSize] = useState("");
   const { data: users, loading, error, refetch } = useGet('users');
  // On component mount, verify and find user from backend users list
useEffect(() => {
    if (users && users.length > 0 && user.name) {
      const foundUser = users.find(
        (FndUser) =>
          FndUser.name === user.name &&
        FndUser.email === user.email
      );
      setCkUser(foundUser || {});
      console.log('Found user:', foundUser);
    }
  }, [users, user.name, user.email]);
  console.log(users)

  // Debug: log cart updates to console
  useEffect(() => {
    console.log("Cart updated:", removeDt);
  }, [removeDt]);

  // Fetch product details by ID whenever 'id' param changes
  useEffect(() => {
    axios
      .get("http://localhost:2345/products")
      .then((response) => {
        // Assuming products are in response.data.all array
        const foundProduct = response.data.find(
          (p) => p.id.toString() === id
        );
        setProduct(foundProduct);
      })
      .catch(console.error);
  }, [id]);

  // Show loading UI if product not yet loaded
  if (!product)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-blue-500 text-xl font-serif animate-pulse">
          Loading product...
        </span>
      </div>
    );

  // Handles adding product to cart (patches user cart array on backend)

  const AddCart = async (e) => {
    e.preventDefault();
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!CkUser?.id) {
      toast.error("User not found. Please log in...");
      return;
    }
    try {
      // Fetch latest user data including cart from backend
      const resUser = await axios.get(
        `http://localhost:2345/users/${CkUser.id}`
      );
      const currentCart = resUser.data.cart || [];

      // Create updated cart array adding current product with unique cartId
      const updatedCart = [
        ...currentCart,
        {
          cartId: uuidv4(),
          id: product.id,
          name: product.name,
          type: product.type,
          price: product.price,
          img: product.img,
          description: product.description,
          availability: product.availability,
          sizes: selectedSize,
          category: product.category,
          features: product.features,
          quantity: quantity,
        },
      ];

      await axios.patch(`http://localhost:2345/users/${CkUser.id}`, {
        cart: updatedCart,
      });
      toast.success("Added To Cart...");
      setRemoveDt(updatedCart); // update whole cart context
    } catch (error) {
      toast.error("Failed to add to cart. Please log in.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl border border-blue-100 overflow-hidden mt-8 font-sans">
      <div className="flex flex-col sm:flex-row">
        {/* Product Image Section */}
        <div className="sm:w-2/5 w-full bg-blue-50 flex justify-center items-center p-8">
          <img
            src={product.img}
            alt="Product"
            className="rounded-2xl shadow-lg w-full max-w-lg object-contain transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
            style={{ height: "340px" }}
          />
        </div>

        {/* Product Info Section */}
        <div className="sm:w-3/5 w-full flex flex-col p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-1 font-serif">
            {product.name}
          </h1>
          <p className="text-lg text-gray-400 mb-1 font-mono">{product.type}</p>
          <span className="text-2xl font-bold text-blue-600 mb-3 font-sans">
            ₹ {product.price}
          </span>


            <div className="flex items-center space-x-2">
              <button
                className="bg-black w-8 h-8 border border-black flex items-center justify-center"
                onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
              >
                -
              </button>

              <div className="bg-white border border-black px-3 py-1 rounded text-center w-12 text-black">
                {quantity}
              </div>

              <button
                className="bg-black w-8 h-8 border border-black flex items-center justify-center "
                onClick={() => setQuantity((qty) => Math.min(10, qty + 1))}
              >
                +
              </button>
              <br/><br/>
            </div>
            <select
              id="size"
              className="w-32 px-2 py-1 border rounded mb-3 font-mono text-lg text-black"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value={""} disabled hidden className="bg-gray-600">
                Size
              </option>
              {product.sizes.map((sz) => (
                <option key={sz} className="bg-gray-600">
                  {sz}
                </option>
              ))}
            </select>

         {product.availability === "Out of Stock" ?
         <span className="bg-red-500 text-white hover:text-black px-6 py-2 rounded hover:bg-red-500 transition mb-3 font-bold font-serif text-lg">
          The Product Is Out-Of Stock
         </span>
         :<button
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-sky-500 transition mb-3 font-bold font-serif text-lg"
            type="button"
            onClick={AddCart}
          >
            Add to Cart
          </button>}
          

          <ul className="text-gray-500 space-y-1 text-base font-mono">
            <li>
              <span className="font-semibold font-sans">Availability:</span>{" "}
              {product.availability}
            </li>
            <li>
              <span className="font-semibold font-sans">Category:</span>{" "}
              {product.category}
            </li>
          </ul>
        </div>
      </div>

      {/* Product Description & Features */}
      <div className="border-t border-blue-100 px-8 py-6 bg-blue-50 font-serif">
        <h2 className="text-xl font-bold mb-2 text-blue-700">
          Product Details
        </h2>
        <p className="text-gray-700 mb-2 text-lg font-mono">
          {product.description}
        </p>
        <ul className="list-disc pl-5 text-blue-600 text-base font-sans">
          {product.features &&
            product.features
              .split(",")
              .map((f, idx) => <li key={idx}>{f.trim()}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default ProductDetails;
