import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useGet from '../Hooks/useGet';

function Featured() {
  const { data: products, loading, error, refetch } = useGet('products','featured');


  return (
    <section className="bg-gray-900 rounded-xl shadow-xl p-5 w-full max-w-full mx-auto">
      <div className="flex items-center justify-between mb-8 px-2 md:px-6">
        <h2 className="text-xl md:text-3xl font-bold text-white">Featured Products</h2>
        <Link
          to="user/search"
          className="text-slate-300 hover:underline font-medium text-xs md:text-base"
        >
          Browse more
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar px-0 sm:px-2 md:px-6">
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
            justify-items-start
            max-w-full
            w-[90vw] sm:w-auto
            mx-auto
          "
        >
          {products.map((db, index) => (
            <div
              key={index}
              className="product-card bg-gray-700 p-4 rounded overflow-hidden w-full"
            >
              <Link to={`user/productdetails/${db.id}`} className="block">
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
                <br />
                <h3
                  className="text-white truncate text-xs md:text-base"
                  title={db.name}
                >
                  {db.name}
                </h3>
                <p
                  className="text-yellow-400 truncate text-[0.65rem] md:text-sm"
                  title={`₹ ${db.price}`}
                >
                  ₹ {db.price}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Featured;
