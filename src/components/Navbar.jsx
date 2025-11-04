import React from "react";
import { NavLink, Link } from 'react-router-dom';
import { RiShoppingCart2Line } from "react-icons/ri";
import { CgProfile, CgSearch } from "react-icons/cg";
import '../App.css';
import Menuebar from "./Menuebar";

function Navbar() {
    const CkUser = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-sky-900 shadow-lg border-b border-sky-800 flex items-center px-4 sm:px-8 z-30">
            
            {/* Left: Nav Links */}
            <div className="flex flex-1 items-center justify-start">
                <Menuebar/>
                <div className="hidden sm:flex space-x-8 text-white font-semibold text-lg items-center">
                    {["Home", "Tops", "Beanie", "Shoes"].map(label => (
                        <NavLink
                            key={label}
                            to={label === "Home" ? "/" : `/${label.toLowerCase()}`}
                            className={({ isActive }) =>
                                `hover:underline hover:text-blue-300 transition duration-200 px-2 py-1 rounded ${
                                    isActive ? "underline text-blue-300 font-bold" : ""
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>
            </div>
            
            {/* Center: Logo */}
            <div className="absolute left-1/2 top-0 h-full flex items-center -translate-x-1/2">
                <Link
                    to="/"
                    className="text-white font-black text-3xl sm:text-4xl new-rocker-regular tracking-widest select-none hover:scale-105 transition-transform"
                    aria-label="DENJO-C Logo"
                    style={{ minWidth: 110, textAlign: "center" }}
                >
                    DENJO-C
                </Link>
            </div>
            
            {/* Right: Icons */}
            <div className="flex flex-1 items-center justify-end space-x-4 ml-4">
                {/* <NavLink
                    to="/search"
                    className="text-white hover:text-blue-300 transition cursor-pointer text-2xl p-2 rounded-full"
                    aria-label="Search"
                >
                    <CgSearch />
                </NavLink> */}
                <NavLink
                    to="/cart"
                    className="relative p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition cursor-pointer text-white text-2xl"
                    aria-label="Cart"
                >
                    <RiShoppingCart2Line />
                    {/* <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">3</span> */}
                </NavLink>
                <NavLink
                    to={CkUser?.name ? "/userprofile" : "/login"}
                    className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition cursor-pointer text-white text-2xl"
                    aria-label="User Profile"
                >
                    <CgProfile />
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;
