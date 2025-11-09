import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import Featured from "./Featured";
import axios from "axios";
import useGet from '../Hooks/useGet';

function Home() {
  const { data: products, loading, error, refetch } = useGet('products','slider');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
 console.log()
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  // Dynamically set slidesToShow and arrows based on window width
  const slidesToShow = windowWidth < 768 ? 1 : 5;
  const arrows = windowWidth >= 768;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="bg-slate-800 min-h-screen p-6">
            {/* Hero Section with Carousel */}
      <section className="relative pt-20 pb-16 bg-slate-800">
        {/* <div className="container mx-auto px-6"> */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-400 mb-4">
              Welcome to Our Store
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Discover quality products with exceptional value
            </p>
          </div>
          </section>
      
      <br />
      <div className="max-w-11/12 mx-auto">
        {/* Slider Section */}
        <section className="mb-12">
          <Slider {...settings}>
            {products.map((db) => (
              <Link
                to={`user/productdetails/${db.id}`}
                key={db.id}
                className="block px-2"
              >
                <img
                  src={db.img}
                  alt={`Product ${db.id}`}
                  className="rounded-lg shadow-lg object-cover w-full h-40 md:h-48 transition-transform duration-300 hover:scale-105"
                />
              </Link>
            ))}
          </Slider>
        </section>
        {/* Featured Products */}
       
       <Featured/>
      </div>
    </div>
  );
}

export default Home;
