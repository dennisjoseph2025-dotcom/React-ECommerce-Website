import React from "react";
import { NavLink } from "react-router-dom";

const linkStyles =
  "text-white no-underline px-2 py-1 rounded transition-colors duration-150 hover:bg-blue-600 hover:text-white active:bg-blue-800";

const Navbar = () => (
  <nav className="flex justify-between items-center bg-gray-900 px-8 py-4 fixed top-0 w-full z-50">
    <div className="font-bold text-lg text-white">DENJO-C</div>
    <ul className="flex gap-8 list-none m-0 p-0">
      <li>
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive ? `${linkStyles} bg-blue-800` : linkStyles
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive ? `${linkStyles} bg-blue-800` : linkStyles
          }
        >
          Products
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? `${linkStyles} bg-blue-800` : linkStyles
          }
        >
          Orders
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive ? `${linkStyles} bg-blue-800` : linkStyles
          }
        >
          Analytics
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? `${linkStyles} bg-blue-800` : linkStyles
          }
        >
          Users
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default Navbar;
