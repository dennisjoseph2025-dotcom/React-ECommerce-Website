import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Searchbar from "../components/Searchbar";

function Beanie() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:2345/products")
      .then((response) => {
        setData(response.data.beanie);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
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
          {data.map((db, index) => (
            <Link
              to={`/productdetails/${db.id}`}
              key={index}
              className="block product-card bg-gray-700 p-5 rounded-2xl overflow-hidden w-full max-w-72"
            >
              <div className="product-card bg-gray-700 rounded overflow-hidden" >
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
              <h3 className="text-white truncate" title={db.name}>
                {db.name}
              </h3>
              <p className="text-yellow-400 truncate" title={`₹ ${db.price}`}>
                ₹ {db.price}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default Beanie;
