import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import toast from 'react-hot-toast';

function Signup() {
  const [data, setData] = useState([]);
  let { user, setUser } = useContext(UserContext);
  const navi = useNavigate();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:2345/users", {
        name: user.name,
        email: user.email,
        password: user.password,
        address: [],
        cart: [],
        order: []
      });
      setData(response.data);
      toast(`😎Registration successful...`);
      setUser({ name: user.name, email: user.email, password: user.password });
      localStorage.setItem('user', JSON.stringify(user));
      navi("/");
    } catch (error) {
      console.error("Error posting data:", error);
      toast("🙁Registration failed...");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-10">
        <h2 className="text-[#00ace6] text-3xl font-extrabold mb-8 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={user.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ace6] text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ace6] text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-900 font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ace6] text-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#00ace6] hover:bg-[#0090cc] transition-colors text-white py-3 rounded-md font-semibold shadow-md"
          >
            Register
          </button>
        </form>
        <div className="mt-6 flex justify-between text-sm font-medium text-[#00ace6]">
          <Link to={"/login"} className="hover:underline">
            Already Have An Account
          </Link>
          <Link to={"/"} className="hover:underline">
            Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
