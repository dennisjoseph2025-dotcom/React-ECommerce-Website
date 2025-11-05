import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";

function Searchbar() {
  const { search, setSearch, type, setType, sort, setSort } = useContext(DataContext);

  return (
    <div
      className="
        max-w-7xl mx-auto mt-20 p-6 bg-slate-800 
        relative z-10
      "
    >
      <section
        className="
          w-full bg-white px-4 py-3 flex flex-nowrap justify-start items-center gap-4 rounded-lg
          transform -translate-y-1 scale-105
        "
        aria-label="Product Filters"
      >
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            h-8 px-2 text-sm border border-gray-600 rounded-md bg-gray-800 placeholder-gray-400
            focus:outline-none focus:border-amber-400 transition-colors duration-300
            flex grow fshrink min-w-0 text-white
          "
        />

        <select
          className="
            h-8 px-2 border border-gray-600 rounded-md text-sm bg-gray-800 text-white
            flex shrink min-w-20
          "
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="All">Type: All</option>
          <option value="oversized shirts">Oversized Shirts</option>
          <option value="oversized polos">Oversized Polos</option>
          <option value="oversized tshirts">Oversized T-Shirts</option>
          <option value="sweatshirts">Sweatshirts</option>
          <option value="tshirts">T-Shirts</option>
          <option value="polos">Polos</option>
          <option value="high top sneakers shoes">High-Top Sneakers</option>
          <option value="low top sneakers shoes">Low-Top Sneakers</option>
          <option value="mid top sneakers shoes">Mid-Top Sneakers</option>
        </select>

        <select
          className="
            h-8 px-2 border border-gray-600 rounded-md text-sm bg-gray-800 text-white
            flex shrink min-w-20
          "
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="Default">Price: Default</option>
          <option value="Low to High">Price: Low to High</option>
          <option value="High to Low">Price: High to Low</option>
        </select>
      </section>
    </div>
  );
}

export default Searchbar;
