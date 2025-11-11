import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import useGet from "../Hooks/useGet";

function Login() {
  const [data, checkData] = useState([]);
  let { user, setUser } = useContext(UserContext);
  const navi = useNavigate();
  const { data: users, loading, error, refetch } = useGet("users");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!users || users.length === 0) {
      toast("❌ No users found in database");
      return;
    }
    const CkUser = users.find(
      (FndUser) =>
        FndUser.name === user.name &&
      FndUser.email === user.email &&
      FndUser.password === user.password
    );
    console.log(CkUser);
        if (!CkUser) {
      toast("🧐 Invalid User...");
      return;
    }
    
    if (
      CkUser.name == "Dennis" &&
      CkUser.email == "dennisjoseph2025@gmail.com" &&
      CkUser.password == "2025"
    ) {
      toast("👑 Welcome Back Admin");
      navi("/admin");
    }
     
    else if (
      CkUser.status === "Active" 

    ) {
        toast("😎Logi-In Successfull...");
        setUser({
          name: CkUser.name,
          email: CkUser.email,
          password: CkUser.password,
        });
        localStorage.setItem("user", JSON.stringify(user));
        navi("/");
       
    }
      else {
      toast("This User Has Been Suspended Or Been Blocked");
    } 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-10">
        <h2 className="text-[#00ace6] text-3xl font-extrabold mb-8 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-semibold mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={user.name || ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ace6] text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={user.email || ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00ace6] text-gray-700"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={user.password || ""}
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
