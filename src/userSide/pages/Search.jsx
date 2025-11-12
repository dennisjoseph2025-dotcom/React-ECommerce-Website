import React, { useState, useEffect } from "react";
import axios from "axios";
import Searchbar from "../components/Searchbar";
import { DataContext } from "../context/DataContext";
import { Link } from "react-router-dom";

function Search() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("Default");

  useEffect(() => {
    axios
      .get("http://localhost:2345/products")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let newData = [...data];

    if (search.trim() !== "") {
      newData = newData.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.type.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type.trim() !== "All") {
      newData = newData.filter((p) =>
        p.type.toLowerCase().includes(type.toLowerCase())
      );
    }

    if (sort.trim() === "Low to High") {
      newData.sort((a, b) => a.price - b.price);
    } else if (sort.trim() === "High to Low") {
      newData.sort((a, b) => b.price - a.price);
    }

    setFilteredData(newData);
  }, [data, search, type, sort]);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        filteredData,
        setFilteredData,
        search,
        setSearch,
        type,
        setType,
        sort,
        setSort,
      }}
    >
      <div className="px-g pb-16">
        <Searchbar />
        <section className="bg-gray-900 rounded-xl shadow-xl p-5 w-full max-w-full mx-auto mt-8">
          <div
            className="
              grid
              grid-cols-2         
              sm:grid-cols-3     
              md:grid-cols-4   
              lg:grid-cols-5       
              gap-6
              justify-items-start
              max-w-full
              w-[90vw] sm:w-auto
              mx-auto
            "
          >
            {filteredData.map((db, index) => (
              <Link
                to={`/user/productdetails/${db.id}`}
                key={index}
                className="block product-card bg-gray-700 p-4 rounded-2xl overflow-hidden w-full max-w-72"
              >
                <div className="product-card bg-gray-700 rounded overflow-hidden">
                  <img
                    src={db.img}
                    alt={db.name}
                    className="
                      mb-2 
                      w-full 
                      max-h-[450px]   /* increased max height on mobile */
                      sm:max-h-[350px]  /* default max height on small and up */
                      object-contain 
                      cursor-pointer 
                      transition-transform 
                      duration-500 
                      ease-in-out 
                      hover:scale-110
                    "
                  />
                </div>
                <h3
                  className="text-white truncate text-sm md:text-base"
                  title={db.name}
                >
                  {db.name}
                </h3>
                <p
                  className="text-yellow-400 truncate text-xs md:text-sm"
                  title={`₹ ${db.price}`}
                >
                  ₹ {db.price}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DataContext.Provider>
  );
}

export default Search;
