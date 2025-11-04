import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import toast from 'react-hot-toast';

function Login() {
  const [data, checkData] = useState([]);
  let { user, setUser } = useContext(UserContext);
  const navi = useNavigate();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:2345/users")
      .then((response) => {
        checkData(response.data);
        console.log(response.data);
        const CkUser = response.data.find(
          (FndUser) =>
            FndUser.name === user.name &&
            FndUser.email === user.email &&
            FndUser.password === user.password
        );
        if (CkUser) {
          toast('😎Logi-In Successfull...')
          setUser({ name: user.name, email: user.email, password: user.password });
          localStorage.setItem('user', JSON.stringify(user));
          navi("/");
        } else {
          toast('🧐Unvalied User...')
        }
      })
      .catch((error) => {
        console.error(error);
      toast('🙁Log-In Failed...')
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-10">
        <h2 className="text-[#00ace6] text-3xl font-extrabold mb-8 text-center">Login</h2>
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
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
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
            Log In
          </button>
        </form>
        <div className="mt-6 flex justify-between text-sm font-medium text-[#00ace6]">
          <Link to={"/signup"} className="hover:underline">
            Create An Account
          </Link>
          <Link to={"/"} className="hover:underline">
            Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
