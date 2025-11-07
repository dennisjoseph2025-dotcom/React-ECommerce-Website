import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { NavLink } from "react-router-dom";
import Sidebar from "./Searchbar";

function Menuebar() {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
  <span
    className="fixed top-3 left-2 z-50  text-gray-100 p-2 rounded-md shadow-md cursor-pointer sm:hidden"
    onClick={() => setIsOpen(!isOpen)}
  >
    ☰
  </span>

  <div
    className={`${isOpen ? "block" : "hidden"} fixed top-0 left-0 h-full bg-slate-800 border-r-2 border-amber-50 z-40 px-4 py-6 flex flex-col space-y-6 w-64 transition-transform duration-300 ease-in-out sm:hidden`}
    style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
    onMouseLeave={() => setIsOpen(false)}
  >
    <div className="flex flex-col text-white font-semibold text-lg items-center">
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
</>
  );
}

export default Menuebar;
