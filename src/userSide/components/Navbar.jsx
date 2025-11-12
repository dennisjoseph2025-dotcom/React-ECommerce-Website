import React from "react";
import { NavLink, Link } from 'react-router-dom';
import { RiShoppingCart2Line } from "react-icons/ri";
import { CgProfile, CgSearch } from "react-icons/cg";
import '../../App.css';
import Menuebar from "./Menuebar";

function Navbar() {
    const CkUser = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <nav className="fixed top-0 left-0 w-full h-16 bg-sky-900 shadow-lg border-b border-sky-800 flex items-center px-4 sm:px-8 z-30">
            
            {/*  Nav Links */}
            <div className="flex flex-1 items-center justify-start">
                <Menuebar/>
                <div className="hidden sm:flex space-x-8 text-white font-semibold text-lg items-center">
                    {["Home", "Tops", "Beanie", "Shoes"].map(label => (
                        <NavLink
                            key={label}
                            to={label === "Home" ? "/" : `user/${label.toLowerCase()}`}
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
            
            {/*  Logo */}
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
            
            {/* Icons */}
            <div className="flex flex-1 items-center justify-end space-x-4 ml-4">
                <NavLink
                    to={CkUser?.name ? "user/cart" : "/login"}
                    className="relative p-2 rounded-full   cursor-pointer text-white text-2xl"
                    aria-label="Cart"
                >
                    <RiShoppingCart2Line />
                </NavLink>
                <NavLink
                    to={CkUser?.name ? "user/profile" : "/login"}
                    className="p-2 rounded-full  transition cursor-pointer text-white text-2xl"
                    aria-label="User Profile"
                >
                    <CgProfile />
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;
